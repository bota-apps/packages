import type { ComponentType, ReactNode } from "react";
import { render, type RenderResult } from "@testing-library/react";
import { createMemoryHistory, type AnyRouter, type RouterHistory } from "@tanstack/react-router";
import type { GraphQLSchema } from "graphql";
import {
  createMockAuthClient,
  createMockGraphQLClient,
  type MockAuthClientOptions,
} from "@bota-apps/mocks";
import { createAppRoot } from "@bota-apps/react-components";
import { createFeatureRegistry, type FeatureNodeDef } from "@bota-apps/fm";
import type { RegisteredAuthUser } from "@bota-apps/types/auth";

type AppearanceConfig = Parameters<typeof createAppRoot>[0]["appearance"];

export type CreateRenderRouteConfig<TContext> = {
  /**
   * The app's own router factory (a thin wrapper over `createHostRouter` from
   * `@bota-apps/react-components`) — a fresh router is built per render with an
   * in-memory history, so tests exercise exactly the options production runs
   * with.
   */
  createRouter: (history: RouterHistory) => AnyRouter;
  /** The app's feature tree — a fresh registry is built per render. */
  featureTree: FeatureNodeDef;
  /** The app-local translation provider, wrapped around the mounted tree. */
  TranslationProvider: ComponentType<{ children: ReactNode }>;
  /**
   * The executable schema the graphql double runs real documents against —
   * pass the app's mock-backend schema (real SDL + real resolvers) so page
   * tests exercise generated documents against real resolvers, with no
   * per-test response stubs to drift.
   */
  schema: GraphQLSchema;
  /** The signed-in persona — must satisfy the app's registered auth user. */
  seedUser: RegisteredAuthUser;
  /**
   * Builds the resolver context for every operation; receives the per-render
   * overrides a test passes as `options.context`.
   */
  graphqlContext: (overrides?: TContext) => unknown;
  /** Forwarded to `createAppRoot` when the app brands its provider stack. */
  appearance?: AppearanceConfig;
};

export type RenderRouteOptions<TContext> = {
  /** Behavioral/override options forwarded to the auth double (defaults to the seeded user). */
  auth?: MockAuthClientOptions<RegisteredAuthUser>;
  /** Overrides forwarded to the app's `graphqlContext` builder. */
  context?: TContext;
};

export type RenderRoute<TContext> = (
  path: string,
  options?: RenderRouteOptions<TContext>,
) => RenderResult;

/**
 * Builds an app's `renderRoute(path)` — the single entry point of its
 * page-level integration tests. Each call mounts the REAL app at `path`: the
 * whole provider stack (`createAppRoot`) and every component run for real;
 * only `authClient` and `graphqlClient` are the `@bota-apps/mocks` doubles,
 * and the graphql double executes against the app's real mock-backend schema.
 */
export function createRenderRoute<TContext>(
  config: CreateRenderRouteConfig<TContext>,
): RenderRoute<TContext> {
  const { TranslationProvider } = config;

  return function renderRoute(path, options = {}) {
    const authClient = createMockAuthClient({ user: config.seedUser, ...options.auth });

    const graphqlClient = createMockGraphQLClient({
      schema: config.schema,
      contextValue: () => config.graphqlContext(options.context),
    });

    const router = config.createRouter(createMemoryHistory({ initialEntries: [path] }));

    const { AppRoot } = createAppRoot({
      authClient,
      graphqlClient,
      router,
      featureRegistry: createFeatureRegistry(config.featureTree),
      appearance: config.appearance,
    });

    return render(
      <TranslationProvider>
        <AppRoot />
      </TranslationProvider>,
    );
  };
}
