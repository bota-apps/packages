import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./index";

const meta: Meta<typeof Kbd> = {
  title: "Display/Kbd",
  component: Kbd,
  args: { children: "K" },
};
export default meta;

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {};

export const SingleKeys: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  ),
};

export const Combo: Story = {
  render: () => (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Kbd>⌘</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd size="sm">⌘</Kbd>
      <Kbd>⌘</Kbd>
    </div>
  ),
};
