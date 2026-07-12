import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ProcessTimelineItem, StatusLegendItem } from "@bota-apps/react-ui";
import { Button, Card, ProcessTimeline, StatusLegend, Stack, Text } from "@bota-apps/react-ui";
import { LifecyclePageSection } from "./index";

const steps: readonly ProcessTimelineItem[] = [
  {
    id: "intake",
    label: "Stage A — Intake",
    description: "Record created and validated against the schema.",
    timestamp: "09:12",
    status: "complete",
  },
  {
    id: "review",
    label: "Stage B — Review",
    description: "Assigned reviewer confirms the details.",
    timestamp: "09:40",
    status: "complete",
  },
  {
    id: "run",
    label: "Stage C — Operational run",
    description: "The record is processed by the current run.",
    timestamp: "10:05",
    status: "current",
  },
  {
    id: "archive",
    label: "Stage D — Archive",
    description: "Completed records move to long-term storage.",
    status: "upcoming",
  },
];

const legendItems: readonly StatusLegendItem[] = [
  { id: "complete", label: "Complete", tone: "success" },
  { id: "current", label: "In progress", tone: "primary" },
  { id: "upcoming", label: "Upcoming", tone: "default" },
];

function timeline() {
  return <ProcessTimeline items={steps} ariaLabel="Record lifecycle stages" />;
}

function legend() {
  return <StatusLegend items={legendItems} ariaLabel="Stage status key" />;
}

function detailsPanel() {
  return (
    <Card title="Current run" description="Stage C — Operational run">
      <Stack gap="sm">
        <Text size="sm" tone="muted">
          Started 10:05 · 2 of 4 stages complete.
        </Text>
        <Text size="sm">
          The active run picks records up in intake order and advances each through the remaining
          stages.
        </Text>
      </Stack>
    </Card>
  );
}

const meta: Meta<typeof LifecyclePageSection> = {
  title: "react-components/LifecyclePageSection",
  component: LifecyclePageSection,
};

export default meta;
type Story = StoryObj<typeof LifecyclePageSection>;

export const Full: Story = {
  render: () => (
    <LifecyclePageSection
      title="Record lifecycle"
      description="How a record moves from intake to archive."
      action={
        <Button variant="outline" size="sm">
          View all records
        </Button>
      }
      legend={legend()}
      timeline={timeline()}
      details={detailsPanel()}
    />
  ),
};

export const TimelineOnly: Story = {
  render: () => (
    <LifecyclePageSection
      title="Record lifecycle"
      description="How a record moves from intake to archive."
      timeline={timeline()}
    />
  ),
};

export const WithDetails: Story = {
  render: () => (
    <LifecyclePageSection title="Record lifecycle" timeline={timeline()} details={detailsPanel()} />
  ),
};

export const NarrowContainer: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <LifecyclePageSection
        title="Record lifecycle"
        description="Stacks the detail panel below the timeline in a narrow container."
        legend={legend()}
        timeline={timeline()}
        details={detailsPanel()}
      />
    </div>
  ),
};
