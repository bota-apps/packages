import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./index";

const meta: Meta<typeof Button> = {
  title: "Forms/Button",
  component: Button,
  args: { children: "Button" },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
/** Chrome-surface controls: styled from the sidebar-* tokens so they stay legible on the shell chrome. */
export const Chrome: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-sidebar p-4 text-sidebar-foreground">
      <Button variant="chrome">Chrome</Button>
      <Button variant="chrome" size="sm">
        Small
      </Button>
      <Button variant="chrome" size="icon" aria-label="Icon action">
        ✳
      </Button>
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
