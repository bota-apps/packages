import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./index";

const meta: Meta<typeof Progress> = {
  title: "Feedback/Progress",
  component: Progress,
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: () => <Progress value={40} className="w-80" />,
};

export const Values: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Progress value={0} />
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={100} />
    </div>
  ),
};
