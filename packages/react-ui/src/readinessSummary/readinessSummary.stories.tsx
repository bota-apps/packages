import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge";
import { ReadinessSummary, type ReadinessGroup } from "./index";

const meta: Meta<typeof ReadinessSummary> = {
  title: "Display/ReadinessSummary",
  component: ReadinessSummary,
};
export default meta;

type Story = StoryObj<typeof ReadinessSummary>;

const groups: ReadinessGroup[] = [
  {
    id: "records",
    title: "Records",
    issues: [
      {
        id: "missing",
        label: "2 records missing required details",
        description: "Add the missing fields before continuing.",
        severity: "error",
        action: <Badge variant="destructive">2</Badge>,
      },
      {
        id: "review",
        label: "1 record flagged for review",
        severity: "warning",
        action: <Badge variant="warning">1</Badge>,
      },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    issues: [
      {
        id: "attachment",
        label: "Supporting attachment not provided",
        description: "Optional, but recommended before submission.",
        severity: "info",
      },
    ],
  },
];

export const Default: Story = {
  args: { title: "Readiness", progress: { complete: 5, total: 8 }, groups },
};

export const Actionable: Story = {
  args: {
    title: "Before you continue",
    progress: { complete: 5, total: 8 },
    groups: groups.map((group) => ({
      ...group,
      issues: group.issues.map((issue) => ({ ...issue, onSelect: () => {} })),
    })),
  },
};

export const Ready: Story = {
  args: {
    title: "Readiness",
    progress: { complete: 8, total: 8 },
    groups: [{ id: "g", issues: [] }],
  },
};

export const WithoutProgress: Story = {
  args: { title: "Outstanding items", groups },
};
