import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "./index";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="popover-width">Width</Label>
            <Input id="popover-width" defaultValue="100%" className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="popover-height">Height</Label>
            <Input id="popover-height" defaultValue="25px" className="col-span-2 h-8" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignedCenter: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Centered popover</Button>
      </PopoverTrigger>
      <PopoverContent align="center" sideOffset={8} className="w-56">
        <p className="text-sm">Aligned to the center of the trigger with extra offset.</p>
      </PopoverContent>
    </Popover>
  ),
};
