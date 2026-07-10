import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./index";
import { chartColors, type ChartSeriesConfig } from "../chartConfig";

const data = [
  { department: "Engineering", completed: 24, open: 4 },
  { department: "Operations", completed: 12, open: 2 },
  { department: "Sales", completed: 18, open: 6 },
  { department: "Finance", completed: 7, open: 1 },
];

const series: ChartSeriesConfig[] = [
  { dataKey: "completed", label: "Completed", color: chartColors.primary },
  { dataKey: "open", label: "Open tasks", color: chartColors.amber },
];

const meta: Meta<typeof BarChart> = {
  title: "Charts/BarChart",
  component: BarChart,
};
export default meta;

type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <BarChart data={data} categoryKey="department" series={series} title="Tasks by team" />
    </div>
  ),
};

export const VerticalWithValues: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <BarChart
        data={data}
        categoryKey="department"
        series={[{ dataKey: "completed", label: "Completed" }]}
        layout="vertical"
        showValues
        showGrid={false}
      />
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <BarChart data={data} categoryKey="department" series={series} stacked size="sm" />
    </div>
  ),
};
