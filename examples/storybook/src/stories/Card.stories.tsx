import type { Meta, StoryObj } from "@storybook/react";
import { Card, Stack, Inline, Badge, Button } from "@bota-apps/react-ui";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Account",
    description: "Manage your account settings and preferences.",
    children: (
      <Stack gap="sm">
        <p className="text-sm text-muted-foreground">
          This card is rendered entirely from the published package — title, description, and
          content slots.
        </p>
      </Stack>
    ),
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    title: "Subscription",
    headerRight: <Badge variant="success">Active</Badge>,
    children: <p className="text-sm text-muted-foreground">Pro plan, billed monthly.</p>,
    footer: (
      <Inline gap="sm">
        <Button size="sm">Manage</Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </Inline>
    ),
  },
};
