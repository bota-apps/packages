import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@bota-apps/react-ui";
import { AuthProvider, type AuthClient, type AuthState } from "@bota-apps/auth-client";
import { OrgSwitcherMenu } from "../orgSwitcherMenu";
import { UserMenu } from "./index";

const authState: AuthState = {
  status: "authenticated",
  user: { id: "u1", name: "Jane Doe", email: "jane@example.com" },
};

const stubAuthClient: AuthClient = {
  getState: () => authState,
  subscribe: () => () => {},
  ensureReady: () => Promise.resolve(),
  refresh: () => Promise.resolve(),
  switchOrganization: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  isAuthenticated: () => true,
  requireSession: () => Promise.resolve(),
  loginUrl: () => "https://auth.example.com/bff/login",
};

const organizations = [
  { id: "org1", name: "Acme Corp", role: "Owner" },
  { id: "org2", name: "Globex Ltd", role: "Admin" },
  { id: "org3", name: "Initech", role: "Member" },
];

const meta: Meta<typeof UserMenu> = {
  title: "react-components/UserMenu",
  component: UserMenu,
  decorators: [
    (Story) => (
      <AuthProvider client={stubAuthClient}>
        <Story />
      </AuthProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {
  args: { onSignOut: () => {} },
};

export const WithOrgSwitcher: Story = {
  render: () => (
    <UserMenu onSignOut={() => {}}>
      <OrgSwitcherMenu
        organizations={organizations}
        currentOrganizationId="org1"
        onSelect={() => {}}
        onCreate={() => {}}
        renderSuffix={(organization) => <Badge variant="secondary">{organization.role}</Badge>}
      />
    </UserMenu>
  ),
};
