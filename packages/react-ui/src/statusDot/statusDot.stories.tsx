import type { Meta, StoryObj } from "@storybook/react";
import { StatusDot } from "./index";

const meta: Meta<typeof StatusDot> = {
  title: "Display/StatusDot",
  component: StatusDot,
};
export default meta;

type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {};

export const Statuses: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-sm">
      <span className="flex items-center gap-1.5">
        <StatusDot status="green" /> Online
      </span>
      <span className="flex items-center gap-1.5">
        <StatusDot status="yellow" /> Away
      </span>
      <span className="flex items-center gap-1.5">
        <StatusDot status="red" /> Offline
      </span>
      <span className="flex items-center gap-1.5">
        <StatusDot status="gray" /> Unknown
      </span>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusDot status="green" size="sm" />
      <StatusDot status="green" size="md" />
    </div>
  ),
};
