import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowDownLeft, ArrowUpRight, Copy, FileUp, Plus } from "lucide-react";
import { SplitButton } from "./index";

const meta: Meta<typeof SplitButton> = {
  title: "Forms/SplitButton",
  component: SplitButton,
  args: {
    children: (
      <>
        <Plus aria-hidden="true" />
        New document
      </>
    ),
    menuLabel: "Open creation options",
    items: [
      {
        id: "incoming",
        label: "New incoming document",
        description: "Start from the incoming template",
        icon: ArrowDownLeft,
        onSelect: () => {},
      },
      {
        id: "outgoing",
        label: "New outgoing document",
        description: "Start from the outgoing template",
        icon: ArrowUpRight,
        onSelect: () => {},
      },
      {
        id: "duplicate",
        label: "Duplicate existing document",
        description: "Start from a previous document",
        icon: Copy,
        separatorBefore: true,
        onSelect: () => {},
      },
      {
        id: "import",
        label: "Import from file",
        description: "Upload a file to prefill the document",
        icon: FileUp,
        onSelect: () => {},
      },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const PlainItems: Story = {
  args: {
    items: [
      { id: "copy", label: "Duplicate", icon: Copy, onSelect: () => {} },
      { id: "import", label: "Import from file", icon: FileUp, onSelect: () => {} },
    ],
  },
};

export const AllItemsHidden: Story = {
  args: {
    items: [{ id: "copy", label: "Duplicate", hidden: true, onSelect: () => {} }],
  },
};
