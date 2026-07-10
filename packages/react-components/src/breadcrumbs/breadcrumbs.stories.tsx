import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Stack, Text } from "@bota-apps/react-ui";
import { toRoutePath } from "../routeLink";
import { BreadcrumbItemsProvider } from "./context";
import { Breadcrumbs } from "./index";
import type { BreadcrumbItem, BreadcrumbVariant } from "./types";

const trail: BreadcrumbItem[] = [
  { label: "Dashboard", to: toRoutePath("/") },
  { label: "Projects", to: toRoutePath("/projects") },
  { label: "Jane Doe", to: toRoutePath("/projects/42") },
  { label: "Assignments" },
];

function withRouter(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof Breadcrumbs> = {
  title: "react-components/Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

const variants: BreadcrumbVariant[] = ["pill", "slash", "highlighted"];

export const AllVariants: Story = {
  render: () =>
    withRouter(
      <Stack gap="md">
        {variants.map((variant) => (
          <Stack key={variant} gap="xs">
            <Text size="sm" tone="muted">
              {variant}
            </Text>
            <BreadcrumbItemsProvider items={trail}>
              <Breadcrumbs variant={variant} />
            </BreadcrumbItemsProvider>
          </Stack>
        ))}
      </Stack>,
    ),
};

export const TwoLevels: Story = {
  render: () =>
    withRouter(
      <BreadcrumbItemsProvider items={trail.slice(0, 2)}>
        <Breadcrumbs />
      </BreadcrumbItemsProvider>,
    ),
};
