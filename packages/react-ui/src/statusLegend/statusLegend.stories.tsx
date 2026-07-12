import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, CircleDot, Minus, TriangleAlert } from "lucide-react";
import { StatusLegend, type StatusLegendItem } from "./index";

const meta: Meta<typeof StatusLegend> = {
  title: "Display/StatusLegend",
  component: StatusLegend,
};
export default meta;

type Story = StoryObj<typeof StatusLegend>;

const lifecycle: StatusLegendItem[] = [
  { id: "complete", label: "Complete", tone: "primary", icon: <Check aria-hidden /> },
  { id: "current", label: "In progress", tone: "success", icon: <CircleDot aria-hidden /> },
  { id: "upcoming", label: "Upcoming", tone: "muted" },
  { id: "blocked", label: "Blocked", tone: "destructive", icon: <TriangleAlert aria-hidden /> },
  { id: "skipped", label: "Skipped", tone: "muted", icon: <Minus aria-hidden /> },
];

export const Horizontal: Story = {
  args: { items: lifecycle, ariaLabel: "Status key" },
};

export const Vertical: Story = {
  args: { items: lifecycle, orientation: "vertical", ariaLabel: "Status key" },
};

export const DotsOnly: Story = {
  args: {
    ariaLabel: "Severity key",
    items: [
      { id: "info", label: "Informational", tone: "default" },
      { id: "warn", label: "Warning", tone: "warning" },
      { id: "error", label: "Critical", tone: "destructive" },
    ],
  },
};

export const SourceKey: Story = {
  args: {
    ariaLabel: "Source key",
    items: [
      { id: "system", label: "System recorded", tone: "primary", icon: <CircleDot aria-hidden /> },
      { id: "manual", label: "Manually recorded", tone: "muted", icon: <Check aria-hidden /> },
    ],
  },
};
