import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { BarChart3, FileText } from "lucide-react";
import { describe, expect, it } from "vitest";
import { createFeatureRegistry, FeatureProvider } from "@bota-apps/fm";
import type { FeatureGateContext, FeatureNodeDef } from "@bota-apps/types/fm";
import { FeatureCard } from "./index";

const tree = {
  id: "app",
  children: [
    {
      id: "app:reports",
      label: "Reports",
      route: "/reports",
      planFeature: "reports",
      meta: { icon: BarChart3 },
    },
    {
      id: "app:secrets",
      label: "Secrets",
      route: "/secrets",
      flag: "secrets",
      meta: { icon: FileText },
    },
  ],
} as const satisfies FeatureNodeDef;

const registry = createFeatureRegistry(tree);

function renderCard(featureId: string, context: FeatureGateContext) {
  const rootRoute = createRootRoute({
    component: () => <FeatureCard featureId={featureId} description="All reports" />,
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

describe("FeatureCard", () => {
  it("renders a linked card from the feature node", async () => {
    renderCard("app:reports", { planFeatures: ["reports"] });

    const link = await screen.findByRole("link", { name: /Reports/ });
    expect(link.getAttribute("href")).toBe("/reports");
    expect(link.textContent).toContain("All reports");
    expect(screen.queryByText("Upgrade")).toBeNull();
  });

  it("badges blocked features", async () => {
    renderCard("app:reports", {});

    expect(await screen.findByText("Upgrade")).toBeTruthy();
  });

  it("renders nothing for hidden features", async () => {
    const { container } = renderCard("app:secrets", {});

    // Wait for the router to mount, then confirm no link appeared.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(container.querySelector("a")).toBeNull();
  });
});
