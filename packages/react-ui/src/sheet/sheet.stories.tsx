import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Sheet, SheetContent, SheetTrigger } from "./index";

const meta: Meta<typeof Sheet> = {
  title: "Overlays/Sheet",
  component: Sheet,
};
export default meta;

type Story = StoryObj<typeof Sheet>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent title="Filters" description="Refine the current list.">
        <p className="text-sm text-muted-foreground">Sheet body content.</p>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open left</Button>
      </SheetTrigger>
      <SheetContent side="left" title="Navigation">
        <p className="text-sm text-muted-foreground">Sheet body content.</p>
      </SheetContent>
    </Sheet>
  ),
};
