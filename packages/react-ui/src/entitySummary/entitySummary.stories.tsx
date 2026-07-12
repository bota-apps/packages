import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge";
import { EntitySummary, type EntitySummaryItem } from "./index";

const meta: Meta<typeof EntitySummary> = {
  title: "Display/EntitySummary",
  component: EntitySummary,
};
export default meta;

type Story = StoryObj<typeof EntitySummary>;

const facts: EntitySummaryItem[] = [
  { id: "reference", label: "Reference", value: "REF-10428" },
  { id: "status", label: "Status", value: <Badge variant="success">Active</Badge> },
  { id: "owner", label: "Owner", value: "A. Contact" },
  { id: "created", label: "Created", value: "24 Jun 2026" },
  { id: "updated", label: "Last updated", value: "07 Jul 2026" },
  { id: "total", label: "Total", value: "$12,480.00" },
  {
    id: "note",
    label: "Note",
    value: "This value is long enough to span the full width of the summary grid.",
    full: true,
  },
];

export const TwoColumns: Story = {
  args: { items: facts, ariaLabel: "Record overview" },
};

export const ThreeColumns: Story = {
  args: { items: facts, columns: 3, ariaLabel: "Record overview" },
  parameters: { layout: "padded" },
};

export const Compact: Story = {
  args: { items: facts, density: "compact", ariaLabel: "Record overview" },
};

export const NarrowContainer: Story = {
  args: { items: facts, columns: 3, ariaLabel: "Record overview" },
  render: (args) => (
    <div style={{ maxWidth: 260 }}>
      <EntitySummary {...args} />
    </div>
  ),
};
