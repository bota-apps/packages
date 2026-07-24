import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { NotificationsMenuItem } from "../notificationsMenu";
import { NotificationsPanel, NotificationsTrigger } from "./index";

const meta: Meta<typeof NotificationsPanel> = {
  title: "App/NotificationsPanel",
  component: NotificationsPanel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof NotificationsPanel>;

const initialItems: readonly NotificationsMenuItem[] = [
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
    description: "12 records updated, 3 exceptions cleared last week.",
    timeLabel: "1d ago",
    read: true,
  },
];

/**
 * The docked sibling of NotificationsMenu: the same items with more room —
 * longer descriptions stay readable and the list survives navigation because
 * the panel is non-modal. The bell trigger toggles it open and closed.
 */
export const BesideContent: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    const [items, setItems] = useState(initialItems);
    return (
      <div className="flex min-h-screen">
        <main className="min-w-0 flex-1 p-8">
          <NotificationsTrigger
            unreadCount={items.filter((item) => !item.read).length}
            active={open}
            onClick={() => setOpen((current) => !current)}
          />
        </main>
        <NotificationsPanel
          open={open}
          onOpenChange={setOpen}
          items={items}
          description="Recent activity across your workspace."
          onMarkAllRead={() => setItems(items.map((item) => ({ ...item, read: true })))}
          onItemSelect={(item) =>
            setItems(
              items.map((entry) => (entry.id === item.id ? { ...entry, read: true } : entry)),
            )
          }
        />
      </div>
    );
  },
};
