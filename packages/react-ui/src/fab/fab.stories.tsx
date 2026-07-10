import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Plus } from "lucide-react";
import { FAB } from "./index";

const meta: Meta<typeof FAB> = {
  title: "Forms/FAB",
  component: FAB,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FAB>;

export const Default: Story = {
  render: () => (
    <div className="relative h-64">
      <p className="p-4 text-sm text-muted-foreground">
        The FAB is fixed to the bottom-right corner of the viewport.
      </p>
      <FAB aria-label="Create new">
        <Plus />
      </FAB>
    </div>
  ),
};

export const BottomLeft: Story = {
  render: () => (
    <div className="relative h-64">
      <p className="p-4 text-sm text-muted-foreground">Positioned bottom-left.</p>
      <FAB position="bottom-left" aria-label="Edit">
        <Pencil />
      </FAB>
    </div>
  ),
};
