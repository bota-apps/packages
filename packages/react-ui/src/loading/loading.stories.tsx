import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loading } from "./index";

const meta: Meta<typeof Loading> = {
  title: "Feedback/Loading",
  component: Loading,
};
export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  render: () => <Loading text="Loading data…" />,
};

export const Inline: Story = {
  render: () => (
    <p className="text-sm">
      Refreshing results <Loading variant="inline" size="sm" text="please wait" />
    </p>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <Loading size="sm" text="sm" />
      <Loading text="default" />
      <Loading size="lg" text="lg" />
    </div>
  ),
};
