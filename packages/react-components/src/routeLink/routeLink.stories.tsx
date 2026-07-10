import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { BarChart3, FileText, Home, Users } from "lucide-react";
import { Stack } from "@bota-apps/react-ui";
import { RouteLink, toRoutePath } from "./index";

// RouteLink renders a router <Link>, so the stories host everything in a
// self-contained in-memory router.
function withRouter(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof RouteLink> = {
  title: "react-components/RouteLink",
  component: RouteLink,
};

export default meta;
type Story = StoryObj<typeof RouteLink>;

export const Text: Story = {
  render: () =>
    withRouter(
      <RouteLink variant="text" to={toRoutePath("/people")} icon={Users} label="People" />,
    ),
};

export const QuickLinks: Story = {
  render: () =>
    withRouter(
      <Stack gap="sm">
        <RouteLink
          variant="quick-link"
          to={toRoutePath("/reports")}
          icon={BarChart3}
          label="Reports"
          description="Analytics and reports"
        />
        <RouteLink
          variant="quick-link"
          to={toRoutePath("/documents")}
          icon={FileText}
          label="Documents"
          description="Files and templates"
        />
      </Stack>,
    ),
};

export const SidebarNavLinks: Story = {
  render: () =>
    withRouter(
      <Stack gap="xs">
        <RouteLink
          variant="side-bar-nav-link"
          to={toRoutePath("/")}
          icon={Home}
          label="Home"
          navVariant="sidebar"
          active
        />
        <RouteLink
          variant="side-bar-nav-link"
          to={toRoutePath("/people")}
          icon={Users}
          label="People"
          navVariant="sidebar"
        />
      </Stack>,
    ),
};
