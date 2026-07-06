import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { BarChart3, FileText, Wallet } from "lucide-react";
import { Stack } from "@bota-apps/react-ui";
import { createFeatureRegistry, FeatureProvider } from "@bota-apps/fm";
import type { FeatureNodeDef } from "@bota-apps/types/fm";
import { FeatureCard } from "./index";

const tree = {
  id: "app",
  children: [
    { id: "app:reports", label: "Reports", route: "/reports", meta: { icon: BarChart3 } },
    {
      id: "app:tasks",
      label: "Tasks",
      route: "/tasks",
      planFeature: "tasks",
      meta: { icon: Wallet },
    },
    { id: "app:documents", label: "Documents", route: "/documents", meta: { icon: FileText } },
  ],
} as const satisfies FeatureNodeDef;

const registry = createFeatureRegistry(tree);

function host(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return (
    <FeatureProvider registry={registry} context={{}}>
      <RouterProvider router={router} />
    </FeatureProvider>
  );
}

const meta: Meta<typeof FeatureCard> = {
  title: "react-components/FeatureCard",
  component: FeatureCard,
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const NavigationHub: Story = {
  render: () =>
    host(
      <Stack gap="sm">
        <FeatureCard featureId="app:reports" description="Analytics and reports" />
        <FeatureCard featureId="app:tasks" description="Boards, tasks, and approvals" />
        <FeatureCard featureId="app:documents" description="Files and templates" />
      </Stack>,
    ),
};
