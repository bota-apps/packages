import type { Meta, StoryObj } from "@storybook/react-vite";
import { AreaChart } from "./index";
import { chartColors, type ChartSeriesConfig } from "../chartConfig";

const data = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 3800, expenses: 2210 },
  { month: "Mar", revenue: 5100, expenses: 2900 },
  { month: "Apr", revenue: 4780, expenses: 3080 },
  { month: "May", revenue: 5890, expenses: 3500 },
  { month: "Jun", revenue: 6390, expenses: 3800 },
];

const series: ChartSeriesConfig[] = [
  { dataKey: "revenue", label: "Revenue", color: chartColors.primary },
  { dataKey: "expenses", label: "Expenses", color: chartColors.rose },
];

const meta: Meta<typeof AreaChart> = {
  title: "Charts/AreaChart",
  component: AreaChart,
};
export default meta;

type Story = StoryObj<typeof AreaChart>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <AreaChart data={data} categoryKey="month" series={series} title="Cash flow" />
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <AreaChart data={data} categoryKey="month" series={series} stacked size="sm" />
    </div>
  ),
};
