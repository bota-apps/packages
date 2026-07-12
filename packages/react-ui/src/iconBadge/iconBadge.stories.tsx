import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, CheckCircle2, FileText, Info, Rocket, XCircle } from "lucide-react";
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
      <IconBadge icon={Info} tone="info" />
      <IconBadge icon={CheckCircle2} tone="success" />
      <IconBadge icon={AlertTriangle} tone="warning" />
      <IconBadge icon={XCircle} tone="destructive" />
      <IconBadge icon={FileText} tone="muted" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconBadge icon={Rocket} size="sm" />
      <IconBadge icon={Rocket} size="md" />
      <IconBadge icon={Rocket} size="lg" />
      <IconBadge icon={Rocket} size="xl" />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconBadge icon={Rocket} shape="square" />
      <IconBadge icon={Rocket} shape="circle" />
      <IconBadge icon={Rocket} size="xl" shape="square" />
      <IconBadge icon={Rocket} size="xl" shape="circle" />
    </div>
  ),
};
