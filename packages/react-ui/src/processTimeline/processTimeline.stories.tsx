import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge";
import { ProcessTimeline, type ProcessTimelineItem } from "./index";

const meta: Meta<typeof ProcessTimeline> = {
  title: "Display/ProcessTimeline",
  component: ProcessTimeline,
};
export default meta;

type Story = StoryObj<typeof ProcessTimeline>;

// Generic, domain-neutral lifecycle — a document/record moving through review.
const lifecycle: ProcessTimelineItem[] = [
  {
    id: "created",
    label: "Created",
    description: "Record drafted and queued.",
    status: "complete",
    timestamp: "Jun 24, 09:12",
  },
  {
    id: "submitted",
    label: "Submitted",
    description: "Sent for review.",
    status: "complete",
    timestamp: "Jun 24, 11:30",
  },
  {
    id: "review",
    label: "In review",
    description: "Awaiting approver sign-off.",
    status: "current",
    timestamp: "Jun 25, 08:05",
    metadata: <Badge variant="secondary">Manually recorded</Badge>,
  },
  { id: "approved", label: "Approved", status: "upcoming" },
  { id: "published", label: "Published", status: "upcoming" },
];

export const Vertical: Story = {
  args: { items: lifecycle, ariaLabel: "Record lifecycle" },
};

export const Horizontal: Story = {
  args: { items: lifecycle, orientation: "horizontal", ariaLabel: "Record lifecycle" },
  parameters: { layout: "padded" },
};

export const Compact: Story = {
  args: { items: lifecycle, density: "compact", ariaLabel: "Record lifecycle" },
};

export const BlockedAndSkipped: Story = {
  args: {
    ariaLabel: "Record lifecycle",
    items: [
      { id: "created", label: "Created", status: "complete", timestamp: "09:12" },
      { id: "validated", label: "Validated", status: "complete", timestamp: "09:20" },
      {
        id: "review",
        label: "In review",
        status: "blocked",
        description: "Blocked: missing required attachment.",
      },
      { id: "optional", label: "Optional step", status: "skipped", description: "Not applicable." },
      { id: "published", label: "Published", status: "upcoming" },
    ],
  },
};

function SelectableTimeline() {
  const [selectedItemId, setSelectedItemId] = useState<string>("review");
  return (
    <ProcessTimeline
      items={lifecycle}
      ariaLabel="Record lifecycle"
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
    />
  );
}

export const Selectable: Story = {
  render: () => <SelectableTimeline />,
};

export const NarrowContainer: Story = {
  args: { items: lifecycle, ariaLabel: "Record lifecycle" },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <ProcessTimeline {...args} />
    </div>
  ),
};

export const HorizontalNarrow: Story = {
  args: { items: lifecycle, orientation: "horizontal", ariaLabel: "Record lifecycle" },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ProcessTimeline {...args} />
    </div>
  ),
};

// A longer, multi-stage flow with mixed sources — resembles an operational run.
export const OperationalRun: Story = {
  args: {
    ariaLabel: "Operational run",
    items: [
      { id: "open", label: "Period opened", status: "complete", timestamp: "Jul 01" },
      { id: "collect", label: "Inputs collected", status: "complete", timestamp: "Jul 05" },
      { id: "validate", label: "Validation", status: "complete", timestamp: "Jul 06" },
      {
        id: "calculate",
        label: "Calculation",
        status: "current",
        description: "Totals being computed.",
        timestamp: "Jul 07",
      },
      { id: "approve", label: "Approval", status: "upcoming" },
      { id: "settle", label: "Settlement", status: "upcoming" },
      { id: "statements", label: "Statements issued", status: "upcoming" },
    ],
  },
};
