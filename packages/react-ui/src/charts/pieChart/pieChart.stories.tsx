import type { Meta, StoryObj } from "@storybook/react";
import { PieChart, DonutChart } from "./index";
import { chartColors, type ChartDataEntry } from "../chartConfig";

const data: ChartDataEntry[] = [
  { label: "Development", value: 62000, color: chartColors.primary },
  { label: "Design", value: 18000, color: chartColors.success },
  { label: "Testing", value: 14500, color: chartColors.amber },
  { label: "Other", value: 5500, color: chartColors.rose },
];

const meta: Meta<typeof PieChart> = {
  title: "Charts/PieChart",
  component: PieChart,
};
export default meta;

type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <PieChart data={data} title="Budget breakdown" />
    </div>
  ),
};

export const Donut: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <DonutChart data={data} centerLabel="Total cost" centerValue="100K" />
    </div>
  ),
};
