import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePlus, LayoutDashboard, Search, Settings, Users } from "lucide-react";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPalette,
  CommandSeparator,
  CommandShortcut,
  useCommandPaletteShortcut,
} from "./index";

const meta: Meta<typeof CommandPalette> = {
  title: "Navigation/CommandPalette",
  component: CommandPalette,
};
export default meta;

type Story = StoryObj<typeof CommandPalette>;

function DemoContent() {
  return (
    <>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem>
            <LayoutDashboard />
            Go to dashboard
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Users />
            Go to members
            <CommandShortcut>G M</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <FilePlus />
            Create record
          </CommandItem>
          <CommandItem>
            <Settings />
            Open settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false);
    useCommandPaletteShortcut(setOpen);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Search />
          Open command palette (⌘K)
        </Button>
        <CommandPalette open={open} onOpenChange={setOpen}>
          <DemoContent />
        </CommandPalette>
      </>
    );
  },
};

export const Inline: Story = {
  render: () => (
    <div className="w-96 rounded-md border shadow-overlay">
      <Command>
        <DemoContent />
      </Command>
    </div>
  ),
};
