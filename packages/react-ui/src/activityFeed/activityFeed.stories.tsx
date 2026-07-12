import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2, PenLine, Send, Upload } from "lucide-react";
import { ActivityFeed, type ActivityFeedItem } from "./index";

const meta: Meta<typeof ActivityFeed> = {
  title: "Display/ActivityFeed",
  component: ActivityFeed,
};
export default meta;

type Story = StoryObj<typeof ActivityFeed>;

const activity: ActivityFeedItem[] = [
  {
    id: "created",
    title: "Record created",
    description: "Drafted and queued for review.",
    timestamp: "Jun 24, 09:12",
    tone: "primary",
    icon: <PenLine aria-hidden />,
  },
  {
    id: "uploaded",
    title: "Document uploaded",
    description: "statement.pdf added to the record.",
    timestamp: "Jun 24, 10:04",
    icon: <Upload aria-hidden />,
  },
  {
    id: "submitted",
    title: "Submitted for approval",
    timestamp: "Jun 24, 11:30",
    icon: <Send aria-hidden />,
  },
  {
    id: "approved",
    title: "Approval granted",
    description: "Signed off by the reviewer.",
    timestamp: "Jun 25, 08:05",
    tone: "success",
    icon: <CheckCircle2 aria-hidden />,
  },
];

export const Default: Story = {
  args: { items: activity, ariaLabel: "Recent activity" },
};

export const Compact: Story = {
  args: { items: activity, density: "compact", ariaLabel: "Recent activity" },
};

export const WithoutConnectors: Story = {
  args: { items: activity, showConnectors: false, ariaLabel: "Recent activity" },
};

export const DotsOnly: Story = {
  args: {
    ariaLabel: "Recent activity",
    items: [
      { id: "a", title: "Status changed to In review", timestamp: "10:12", tone: "primary" },
      { id: "b", title: "Comment added", timestamp: "10:20" },
      { id: "c", title: "Status changed to Approved", timestamp: "11:44", tone: "success" },
    ],
  },
};

export const Empty: Story = {
  args: { items: [], ariaLabel: "Recent activity" },
};
