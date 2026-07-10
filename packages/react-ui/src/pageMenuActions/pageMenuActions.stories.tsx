import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, Download, FileText, Pencil, Trash2 } from "lucide-react";
import { PageMenuActions } from "./index";

const meta: Meta<typeof PageMenuActions> = {
  title: "Layout/PageMenuActions",
  component: PageMenuActions,
};
export default meta;

type Story = StoryObj<typeof PageMenuActions>;

export const Default: Story = {
  args: {
    actions: [
      { label: "Edit", icon: Pencil },
      { label: "Duplicate", icon: Copy },
      { label: "Archive", disabled: true },
      { label: "Delete", icon: Trash2, variant: "destructive" },
    ],
  },
};

export const WithSubmenu: Story = {
  args: {
    actions: [
      { label: "Edit", icon: Pencil },
      {
        label: "Export",
        icon: Download,
        children: [{ label: "PDF", icon: FileText }, { label: "CSV" }],
      },
      { label: "Delete", icon: Trash2, variant: "destructive" },
    ],
  },
};
