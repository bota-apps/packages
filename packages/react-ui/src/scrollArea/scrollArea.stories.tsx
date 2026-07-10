import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea, ScrollBar } from "./index";
import { Separator } from "../separator";

const meta: Meta<typeof ScrollArea> = {
  title: "Display/ScrollArea",
  component: ScrollArea,
};
export default meta;

type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 30 }, (_, i) => `Release v1.${i}.0`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-64 w-56 rounded-md border">
      <div className="p-4">
        <p className="mb-3 text-sm font-medium">Releases</p>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="py-1.5 text-sm">{tag}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-80 whitespace-nowrap rounded-md border">
      <div className="flex w-max gap-4 p-4">
        {tags.slice(0, 12).map((tag) => (
          <div key={tag} className="rounded-md bg-muted px-3 py-2 text-sm">
            {tag}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
