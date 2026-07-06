import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Download, Eye } from "lucide-react";
import { Button, Stack, Text } from "@bota-apps/react-ui";
import { toRoutePath } from "../routeLink";
import { DeleteAction } from "./deleteAction";
import { EditAction } from "./editAction";
import { PageActions } from "./pageActions";
import { RowActionButton } from "./rowActionButton";
import { RowActions } from "./rowActions";

function withRouter(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return <RouterProvider router={router} />;
}

const meta: Meta = {
  title: "react-components/Actions",
};

export default meta;
type Story = StoryObj;

export const PageActionsRow: Story = {
  render: () =>
    withRouter(
      <PageActions>
        <Button variant="outline">Export</Button>
        <Button>Add project</Button>
        <DeleteAction
          title="Delete project?"
          description="This permanently removes the project and its history."
          confirmLabel="Delete"
          onConfirm={() => {}}
        />
      </PageActions>,
    ),
};

export const RowActionsCell: Story = {
  render: () =>
    withRouter(
      <Stack gap="sm">
        <Text tone="muted" size="sm">
          Trailing cell of a table row:
        </Text>
        <RowActions>
          <RowActionButton icon={Eye} onClick={() => {}} label="View" />
          <RowActionButton icon={Download} onClick={() => {}} label="Download" />
          <EditAction to={toRoutePath("/projects/42/edit")} label="Edit" />
        </RowActions>
      </Stack>,
    ),
};
