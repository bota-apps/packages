import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./index";

const meta: Meta<typeof Badge> = {
  title: "Display/Badge",
  component: Badge,
  args: { children: "Badge" },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge>Default</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="count">3</Badge>
    </div>
  ),
};
