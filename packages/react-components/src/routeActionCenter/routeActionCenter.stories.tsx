import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { CircleCheck, FileText, Settings, Users } from "lucide-react";
import { Card } from "@bota-apps/react-ui";
import { RouteActionCenter, type RouteAction } from "./index";
import { toRoutePath } from "../routeLink";

// RouteActionCenter renders router <Link>s, so the stories host everything in a
// self-contained in-memory router.
function withRouter(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof RouteActionCenter> = {
  title: "react-components/RouteActionCenter",
  component: RouteActionCenter,
};

export default meta;
type Story = StoryObj<typeof RouteActionCenter>;

const baseActions: readonly RouteAction[] = [
  {
    id: "review",
    label: "Review pending items",
    description: "A few records need your attention",
    icon: <CircleCheck />,
    tone: "primary",
    to: toRoutePath("/records"),
  },
  {
    id: "people",
    label: "Invite a teammate",
    description: "Add people to the workspace",
    icon: <Users />,
    to: toRoutePath("/people"),
  },
  {
    id: "settings",
    label: "Finish setup",
    description: "Complete your workspace settings",
    icon: <Settings />,
    tone: "warning",
    to: toRoutePath("/settings"),
  },
];

export const Default: Story = {
  render: () =>
    withRouter(
      <Card className="max-w-sm p-4">
        <RouteActionCenter actions={baseActions} ariaLabel="Next actions" />
      </Card>,
    ),
};

export const WithTrailingBadges: Story = {
  render: () =>
    withRouter(
      <Card className="max-w-sm p-4">
        <RouteActionCenter
          ariaLabel="Next actions"
          actions={[
            {
              id: "records",
              label: "Open records",
              description: "Items awaiting review",
              icon: <FileText />,
              tone: "primary",
              to: toRoutePath("/records"),
              trailing: (
                <span className="rounded-full bg-selected px-2 py-0.5 text-xs font-medium text-selected-foreground">
                  12
                </span>
              ),
            },
            {
              id: "people",
              label: "Pending invites",
              icon: <Users />,
              to: toRoutePath("/people"),
              trailing: (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  3
                </span>
              ),
            },
          ]}
        />
      </Card>,
    ),
};

export const Empty: Story = {
  render: () =>
    withRouter(
      <Card className="max-w-sm p-4">
        <RouteActionCenter actions={[]} ariaLabel="Next actions" />
      </Card>,
    ),
};
