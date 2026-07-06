import type { Meta, StoryObj } from "@storybook/react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./index";

const meta: Meta<typeof Collapsible> = {
  title: "Display/Collapsible",
  component: Collapsible,
};
export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold">3 starred repositories</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm">bota-apps/react-ui</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">bota-apps/api</div>
        <div className="rounded-md border px-4 py-2 text-sm">bota-apps/web</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-80 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border px-4 py-2 text-sm text-muted-foreground">
        Starts expanded via defaultOpen.
      </CollapsibleContent>
    </Collapsible>
  ),
};
