import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./index";

const meta: Meta<typeof Separator> = {
  title: "Display/Separator",
  component: Separator,
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-sm font-medium">Bota UI</p>
      <p className="text-sm text-muted-foreground">Shared component library.</p>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">Everything below the fold.</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Changelog</span>
      <Separator orientation="vertical" />
      <span>Support</span>
    </div>
  ),
};
