import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { RouteError } from "./index";

function withRouter(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof RouteError> = {
  title: "react-components/RouteError",
  component: RouteError,
};

export default meta;
type Story = StoryObj<typeof RouteError>;

export const Default: Story = {
  render: () => withRouter(<RouteError error={new Error("The route loader failed.")} />),
};
