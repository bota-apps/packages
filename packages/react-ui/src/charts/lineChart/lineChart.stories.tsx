import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./index";
import { chartColors, type ChartSeriesConfig } from "../chartConfig";

const data = [
  { week: "W1", active: 320, new: 40 },
  { week: "W2", active: 355, new: 52 },
  { week: "W3", active: 349, new: 31 },
  { week: "W4", active: 410, new: 68 },
  { week: "W5", active: 452, new: 60 },
  { week: "W6", active: 470, new: 45 },
];

const series: ChartSeriesConfig[] = [
  { dataKey: "active", label: "Active users", color: chartColors.primary },
  { dataKey: "new", label: "New signups", color: chartColors.success },
];

const meta: Meta<typeof LineChart> = {
  title: "Charts/LineChart",
  component: LineChart,
};
export default meta;

type Story = StoryObj<typeof LineChart>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <LineChart data={data} categoryKey="week" series={series} title="Weekly usage" />
    </div>
  ),
};

export const StraightLinesNoGrid: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <LineChart
        data={data}
        categoryKey="week"
        series={[{ dataKey: "active", label: "Active users" }]}
        curved={false}
        showGrid={false}
        size="sm"
      />
    </div>
  ),
};
