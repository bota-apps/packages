import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic } from "lucide-react";
import { Toggle } from "./index";

const meta: Meta<typeof Toggle> = {
  title: "Forms/Toggle",
  component: Toggle,
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold />
    </Toggle>
  ),
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle size="sm" aria-label="Toggle bold small">
        <Bold />
      </Toggle>
      <Toggle aria-label="Toggle bold default">
        <Bold />
      </Toggle>
      <Toggle size="lg" aria-label="Toggle bold large">
        <Bold />
      </Toggle>
    </div>
  ),
};

export const PressedAndDisabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle defaultPressed aria-label="Toggle bold pressed" onPressedChange={() => {}}>
        <Bold />
      </Toggle>
      <Toggle disabled aria-label="Toggle italic disabled">
        <Italic />
      </Toggle>
    </div>
  ),
};
