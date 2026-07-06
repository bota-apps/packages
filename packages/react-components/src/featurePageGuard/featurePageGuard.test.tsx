import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";
import { createFeatureRegistry, FeatureProvider } from "@bota-apps/fm";
import type { FeatureGateContext, FeatureNodeDef } from "@bota-apps/types/fm";
import { FeaturePageGuard } from "./index";

const tree = {
  id: "app",
  children: [
    {
      id: "app:reports",
      label: "Custom Reports",
      route: "/reports",
      planFeature: "custom-reports",
    },
    { id: "app:secrets", label: "Secrets", route: "/secrets", flag: "secrets" },
    { id: "app:open", label: "Open", route: "/open" },
  ],
} as const satisfies FeatureNodeDef;

const registry = createFeatureRegistry(tree);

function renderGuarded(featureId: string, context: FeatureGateContext, onCta?: () => void) {
  // The hidden branch renders NotFound (RouteLink inside) — host in a router.
  const rootRoute = createRootRoute({
    component: () => (
      <FeaturePageGuard featureId={featureId} onCta={onCta}>
        <p>Feature content</p>
      </FeaturePageGuard>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(
    <FeatureProvider registry={registry} context={context}>
      <RouterProvider router={router} />
    </FeatureProvider>,
  );
}

describe("FeaturePageGuard", () => {
  it("renders children when the feature is ready", async () => {
    renderGuarded("app:open", {});
    expect(await screen.findByText("Feature content")).toBeTruthy();
  });

  it("renders the 404 page for hidden features", async () => {
    renderGuarded("app:secrets", {});
    expect(await screen.findByText("404 — Not Found")).toBeTruthy();
    expect(screen.queryByText("Feature content")).toBeNull();
  });

  it("renders the plan-derived blocked screen with a working CTA", async () => {
    const onCta = vi.fn();
    renderGuarded("app:reports", {}, onCta);

    expect(await screen.findByText("Upgrade your plan")).toBeTruthy();
    expect(screen.queryByText("Feature content")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "View Plans" }));
    expect(onCta).toHaveBeenCalledOnce();
  });

  it("lets the plan grant open the feature", async () => {
    renderGuarded("app:reports", { planFeatures: ["custom-reports"] });
    expect(await screen.findByText("Feature content")).toBeTruthy();
  });
});
