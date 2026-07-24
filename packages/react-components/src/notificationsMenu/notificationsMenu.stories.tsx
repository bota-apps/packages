import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationsMenu } from "./index";

const meta: Meta<typeof NotificationsMenu> = {
  title: "App/NotificationsMenu",
  component: NotificationsMenu,
};
export default meta;

type Story = StoryObj<typeof NotificationsMenu>;

const items = [
  {
    id: "n1",
    title: "Document approved",
    description: "STMT-2041 cleared review and moved to the next stage.",
    timeLabel: "12m ago",
    read: false,
  },
  {
    id: "n2",
    title: "New comment on REF-10428",
    description: "“Can you confirm the revised delivery window?”",
    timeLabel: "2h ago",
    read: false,
  },
  {
    id: "n3",
    title: "Weekly summary ready",
    timeLabel: "1d ago",
    read: true,
  },
];

export const Default: Story = {
  args: {
    items,
    onMarkAllRead: () => {},
  },
};

export const Empty: Story = {
  args: { items: [] },
};

/** On the shell chrome the bell uses the chrome button variant. */
export const OnChrome: Story = {
  render: (args) => (
    <div className="flex justify-end gap-2 bg-sidebar p-4 text-sidebar-foreground">
      <NotificationsMenu {...args} variant="chrome" />
    </div>
  ),
  args: { items },
};
