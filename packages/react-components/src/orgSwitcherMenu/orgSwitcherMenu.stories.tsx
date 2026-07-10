import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@bota-apps/react-ui";
import { OrgSwitcherMenu } from "./index";

const organizations = [
  { id: "org1", name: "Acme Corp", role: "Owner" },
  { id: "org2", name: "Globex Ltd", role: "Admin" },
  { id: "org3", name: "Initech", role: "Member" },
];

const meta: Meta<typeof OrgSwitcherMenu> = {
  title: "react-components/OrgSwitcherMenu",
  component: OrgSwitcherMenu,
  decorators: [
    (Story) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Story />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrgSwitcherMenu>;

export const Default: Story = {
  render: () => (
    <OrgSwitcherMenu
      organizations={organizations}
      currentOrganizationId="org1"
      onSelect={() => {}}
    />
  ),
};

export const WithRoleBadgesAndCreate: Story = {
  render: () => (
    <OrgSwitcherMenu
      organizations={organizations}
      currentOrganizationId="org1"
      onSelect={() => {}}
      onCreate={() => {}}
      renderSuffix={(organization) => <Badge variant="secondary">{organization.role}</Badge>}
    />
  ),
};
