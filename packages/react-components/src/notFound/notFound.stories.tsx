import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { NotFound } from "./index";

function withRouter(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof NotFound> = {
  title: "react-components/NotFound",
  component: NotFound,
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {
  render: () => withRouter(<NotFound />),
};
