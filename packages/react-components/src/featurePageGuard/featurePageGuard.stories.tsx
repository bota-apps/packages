import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Text } from "@bota-apps/react-ui";
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
    { id: "app:tasks", label: "Tasks", route: "/tasks", setup: "workspace-setup" },
    { id: "app:secrets", label: "Secrets", route: "/secrets", flag: "secrets" },
  ],
} as const satisfies FeatureNodeDef;

const registry = createFeatureRegistry(tree);

function host(featureId: string, context: FeatureGateContext, children: ReactNode) {
  const rootRoute = createRootRoute({
    component: () => (
      <FeaturePageGuard featureId={featureId} onCta={() => {}}>
        {children}
      </FeaturePageGuard>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return (
    <FeatureProvider registry={registry} context={context}>
      <RouterProvider router={router} />
    </FeatureProvider>
  );
}

const meta: Meta<typeof FeaturePageGuard> = {
  title: "react-components/FeaturePageGuard",
  component: FeaturePageGuard,
};

export default meta;
type Story = StoryObj<typeof FeaturePageGuard>;

export const Ready: Story = {
  render: () =>
    host("app:reports", { planFeatures: ["custom-reports"] }, <Text>The reports page.</Text>),
};

export const BlockedByPlan: Story = {
  render: () => host("app:reports", {}, <Text>The reports page.</Text>),
};

export const BlockedBySetup: Story = {
  render: () => host("app:tasks", {}, <Text>The tasks page.</Text>),
};

export const Hidden: Story = {
  render: () => host("app:secrets", {}, <Text>The secrets page.</Text>),
};
