// The engine asserts with jest-dom matchers (`toBeVisible`, `toBeNull` on
// queries) — register them here so the engine works even when an app's setup
// file doesn't import `@bota-apps/testing/setup`.
import "@testing-library/jest-dom/vitest";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RenderRoute } from "../renderRoute/createRenderRoute";

// The copy the shared error surfaces render by default: the RouteError
// boundary (a thrown/rejected render) and PageContainer's
// `state={{ kind: "error" }}` (e.g. a null detail result).
const defaultErrorCopy = /something went wrong/i;

// The shared NotFound page (createHostRouter's defaultNotFoundComponent). It
// renders INSIDE the authenticated shell with no error copy, so without this
// check a typo'd catalog path or a route that throws notFound() would pass.
const defaultNotFoundCopy = /404 — not found/i;

export type RouteCatalog = Record<string, readonly string[]>;

export type CreateRouteSmokeConfig<TCatalog extends RouteCatalog, TContext> = {
  /** The app's `renderRoute` (from `createRenderRoute`). */
  renderRoute: RenderRoute<TContext>;
  /** Every navigable page path, grouped by zone — the app's route catalog. */
  catalog: TCatalog;
  /**
   * Paths whose feature flag is off in the seed, so the FeaturePageGuard's
   * NotFound gate IS the expected page — the smoke asserts the gate for these.
   */
  gatedRoutePaths?: ReadonlySet<string>;
  /**
   * Copy that proves the authenticated shell mounted around the route outlet
   * (e.g. `signed in as <seeded user>`). Derive it from the seed persona.
   */
  shellCopy: RegExp;
  /** Override when the app replaces the shared error surface copy. */
  errorCopy?: RegExp;
  /** Override when the app replaces the shared NotFound copy. */
  notFoundCopy?: RegExp;
  /** Per-route timeout for a terminal surface to appear (default 8000 ms). */
  timeout?: number;
};

export type RouteSmoke<TCatalog extends RouteCatalog, TContext> = {
  expectRouteRenders: (
    path: string,
    options?: Parameters<RenderRoute<TContext>>[1],
  ) => Promise<void>;
  describeRouteSmoke: (zone: keyof TCatalog & string) => void;
};

/**
 * Builds an app's route-smoke engine. `expectRouteRenders(path)` mounts the
 * real route at `path` through the whole provider stack, waits for a terminal
 * surface — shell, error, or 404 — and asserts the route rendered its content
 * rather than an error or 404 surface (flag-gated stubs assert their gate
 * instead). `describeRouteSmoke(zone)` is the whole body of a zone's smoke
 * file — one zone per test FILE, so vitest parallelizes across zones.
 */
export function createRouteSmoke<TCatalog extends RouteCatalog, TContext>(
  config: CreateRouteSmokeConfig<TCatalog, TContext>,
): RouteSmoke<TCatalog, TContext> {
  const {
    renderRoute,
    catalog,
    gatedRoutePaths = new Set<string>(),
    shellCopy,
    errorCopy = defaultErrorCopy,
    notFoundCopy = defaultNotFoundCopy,
    timeout = 8000,
  } = config;

  async function expectRouteRenders(
    path: string,
    options?: Parameters<RenderRoute<TContext>>[1],
  ): Promise<void> {
    renderRoute(path, options);

    // Wait for whichever surface wins — shell, error, or 404. Stopping on the
    // first one keeps a hard-crashed route from burning the whole timeout
    // waiting for a shell that will never mount. Generous default timeout: the
    // suite mounts the full app per route and runs suspense queries under
    // parallel load.
    await waitFor(
      () => {
        const surfaced = [shellCopy, errorCopy, notFoundCopy].some(
          (copy) => screen.queryByText(copy) !== null,
        );
        expect(surfaced, `route "${path}" rendered no recognizable surface`).toBe(true);
      },
      { timeout },
    );

    expect(
      screen.queryByText(errorCopy),
      `route "${path}" rendered an error surface (${String(errorCopy)})`,
    ).toBeNull();
    if (gatedRoutePaths.has(path)) {
      // Flag-gated stub: the FeaturePageGuard's NotFound gate IS the expected
      // page. If this fails, the flag flipped on in the seed — move the path
      // out of gatedRoutePaths and assert the real page.
      expect(
        screen.queryByText(notFoundCopy),
        `route "${path}" is in gatedRoutePaths but its gate did not render — flag now enabled?`,
      ).not.toBeNull();
    } else {
      expect(
        screen.queryByText(notFoundCopy),
        `route "${path}" rendered the 404 page — catalog path typo, missing route file, or a FeaturePageGuard whose flag is off (see gatedRoutePaths)`,
      ).toBeNull();
    }
    expect(screen.getByText(shellCopy)).toBeVisible();
  }

  function describeRouteSmoke(zone: keyof TCatalog & string): void {
    describe(`route smoke: ${zone}`, () => {
      it.each(catalog[zone])("renders %s", async (path) => {
        await expectRouteRenders(path);
      });
    });
  }

  return { expectRouteRenders, describeRouteSmoke };
}
