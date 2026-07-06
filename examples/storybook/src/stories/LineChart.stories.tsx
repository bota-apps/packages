import type { Meta, StoryObj } from "@storybook/react";
// Imported from the separate `/charts` entry point — this story verifies that
// subpath export resolves and renders independently of the main barrel.
import { LineChart } from "@bota-apps/react-ui/charts";

const data = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 3800, expenses: 2210 },
  { month: "Mar", revenue: 5100, expenses: 2900 },
  { month: "Apr", revenue: 4700, expenses: 2600 },
  { month: "May", revenue: 6200, expenses: 3100 },
  { month: "Jun", revenue: 5800, expenses: 3300 },
];

const meta = {
  title: "Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data,
    categoryKey: "month",
    series: [{ dataKey: "revenue", label: "Revenue" }],
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSeries: Story = {
  args: { title: "Monthly revenue" },
};

export const MultiSeries: Story = {
  args: {
    title: "Revenue vs expenses",
    series: [
      { dataKey: "revenue", label: "Revenue", color: 1 },
      { dataKey: "expenses", label: "Expenses", color: 3 },
    ],
  },
};
