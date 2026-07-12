import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Stack } from "@bota-apps/react-ui";
import { OperationalDashboard } from "./index";

const meta: Meta<typeof OperationalDashboard> = {
  title: "react-components/OperationalDashboard",
  component: OperationalDashboard,
};

export default meta;
type Story = StoryObj<typeof OperationalDashboard>;

function Panel({ title, height = "h-32" }: { title: string; height?: string }) {
  return (
    <div className={`rounded-lg border bg-card p-4 text-card-foreground ${height}`}>
      <div className="text-sm font-medium">{title}</div>
    </div>
  );
}

function primaryContent(): ReactNode {
  return (
    <Stack gap="lg">
      <Panel title="Trend overview" height="h-48" />
      <Panel title="Recent activity" height="h-40" />
    </Stack>
  );
}

function secondaryContent(): ReactNode {
  return (
    <Stack gap="lg">
      <Panel title="Readiness" />
      <Panel title="Quick actions" />
    </Stack>
  );
}

export const Balanced: Story = {
  render: () => (
    <OperationalDashboard
      ariaLabel="Overview dashboard"
      primary={primaryContent()}
      secondary={secondaryContent()}
    />
  ),
};

export const PrimaryHeavy: Story = {
  render: () => (
    <OperationalDashboard
      ariaLabel="Overview dashboard"
      ratio="primary"
      primary={primaryContent()}
      secondary={secondaryContent()}
    />
  ),
};

export const SecondaryHeavy: Story = {
  render: () => (
    <OperationalDashboard
      ariaLabel="Overview dashboard"
      ratio="secondary"
      primary={primaryContent()}
      secondary={secondaryContent()}
    />
  ),
};

export const PrimaryOnly: Story = {
  render: () => <OperationalDashboard ariaLabel="Overview dashboard" primary={primaryContent()} />,
};

export const NarrowContainer: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="w-72 rounded-lg border p-4">
        <OperationalDashboard
          ariaLabel="Narrow dashboard"
          ratio="primary"
          primary={primaryContent()}
          secondary={secondaryContent()}
        />
      </div>
      <div className="flex-1 rounded-lg border p-4">
        <OperationalDashboard
          ariaLabel="Wide dashboard"
          ratio="primary"
          primary={primaryContent()}
          secondary={secondaryContent()}
        />
      </div>
    </div>
  ),
};
