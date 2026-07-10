import type { Meta, StoryObj } from "@storybook/react-vite";
import { StackedBar } from "./index";

const meta: Meta<typeof StackedBar> = {
  title: "Display/StackedBar",
  component: StackedBar,
};
export default meta;

type Story = StoryObj<typeof StackedBar>;

const headcountByDepartment = [
  { key: "engineering", value: 46, color: "bg-chart-1", label: "Engineering" },
  { key: "operations", value: 28, color: "bg-chart-2", label: "Operations" },
  { key: "finance", value: 14, color: "bg-chart-3", label: "Finance" },
  { key: "hr", value: 8, color: "bg-chart-4", label: "HR" },
];

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <StackedBar segments={headcountByDepartment} />
    </div>
  ),
};

export const Heights: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <StackedBar segments={headcountByDepartment} height="sm" />
      <StackedBar segments={headcountByDepartment} height="md" />
      <StackedBar segments={headcountByDepartment} height="lg" />
    </div>
  ),
};

/** Zero-value segments are dropped; a single remaining segment renders fully rounded. */
export const SingleSegment: Story = {
  render: () => (
    <div className="w-96">
      <StackedBar
        segments={[
          { key: "paid", value: 32, color: "bg-chart-2", label: "Paid" },
          { key: "overdue", value: 0, color: "bg-chart-5", label: "Overdue" },
        ]}
      />
    </div>
  ),
};
