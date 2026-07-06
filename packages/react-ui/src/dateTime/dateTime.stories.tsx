import type { Meta, StoryObj } from "@storybook/react";
import { DateTime } from "./index";

const meta: Meta<typeof DateTime> = {
  title: "Display/DateTime",
  component: DateTime,
};
export default meta;

type Story = StoryObj<typeof DateTime>;

export const Default: Story = {
  render: () => <DateTime value="2026-04-04" />,
};

export const Variants: Story = {
  render: () => (
    <div className="grid w-80 grid-cols-[7rem_1fr] items-baseline gap-2 text-sm">
      <span className="text-muted-foreground">date</span>
      <DateTime value="2026-04-04" variant="date" />
      <span className="text-muted-foreground">date-short</span>
      <DateTime value="2026-04-04" variant="date-short" />
      <span className="text-muted-foreground">datetime</span>
      <DateTime value="2026-04-04T14:30:00" variant="datetime" />
      <span className="text-muted-foreground">time</span>
      <DateTime value="2026-04-04T14:30:00" variant="time" />
      <span className="text-muted-foreground">date-range</span>
      <DateTime value="2026-04-01/2026-04-30" variant="date-range" />
      <span className="text-muted-foreground">month-year</span>
      <DateTime value="2026-04-04" variant="month-year" />
      <span className="text-muted-foreground">relative</span>
      <DateTime value="2026-04-04T14:30:00" variant="relative" />
    </div>
  ),
};

export const TonesAndSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <DateTime value="2026-04-04" size="sm" tone="muted" />
      <DateTime value="2026-04-04" size="md" />
      <DateTime value="2026-04-04" size="lg" />
    </div>
  ),
};
