import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2, FileText, Rocket } from "lucide-react";
import { IconBadge } from "./index";

const meta: Meta<typeof IconBadge> = {
  title: "Display/IconBadge",
  component: IconBadge,
};
export default meta;

type Story = StoryObj<typeof IconBadge>;

export const Default: Story = {
  render: () => <IconBadge icon={Rocket} />,
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconBadge icon={Rocket} tone="primary" />
      <IconBadge icon={CheckCircle2} tone="success" />
      <IconBadge icon={FileText} tone="muted" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconBadge icon={Rocket} size="md" />
      <IconBadge icon={Rocket} size="lg" />
    </div>
  ),
};
