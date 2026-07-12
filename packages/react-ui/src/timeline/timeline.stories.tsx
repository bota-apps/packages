import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, Check, MessageSquare, Package, XCircle } from "lucide-react";
import { Timeline, TimelineItem } from "./index";

const meta: Meta<typeof Timeline> = {
  title: "Display/Timeline",
  component: Timeline,
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        title="Order placed"
        meta="Jun 24, 09:12"
        description="Order #1042 was created and queued for processing."
      />
      <TimelineItem title="Comment added" meta="Jun 24, 11:30" />
      <TimelineItem
        title="Status changed"
        meta="Jun 25, 08:05"
        description="Moved from Pending to In progress."
      />
      <TimelineItem title="Order shipped" meta="Jun 26, 14:47" />
    </Timeline>
  ),
};

export const WithIconsAndTones: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        tone="success"
        icon={<Check />}
        title="Payment received"
        meta="Jun 24, 09:12"
        description="Invoice #88 settled in full."
      />
      <TimelineItem
        tone="primary"
        icon={<Package />}
        title="Order shipped"
        meta="Jun 25, 10:02"
        description="Tracking number assigned."
      />
      <TimelineItem
        tone="default"
        icon={<MessageSquare />}
        title="Comment added"
        meta="Jun 25, 16:40"
      />
      <TimelineItem
        tone="warning"
        icon={<AlertTriangle />}
        title="Delivery delayed"
        meta="Jun 27, 08:15"
        description="Carrier reported a routing delay."
      />
      <TimelineItem
        tone="destructive"
        icon={<XCircle />}
        title="Delivery attempt failed"
        meta="Jun 28, 12:31"
        description="Recipient unavailable; a new attempt is scheduled."
      />
    </Timeline>
  ),
};
