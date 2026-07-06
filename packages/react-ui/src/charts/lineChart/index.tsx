import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Stack } from "../../html/layout";
import { Heading } from "../../html/typography";
import { chartColorByIndex, type ChartSeriesConfig, type ChartSize } from "../chartConfig";
import { useChartHeight } from "../useChartSize";
import { ChartTooltipContent } from "../chartTooltip";
import { ChartLegend } from "../chartLegend";
import { lineChartVariants } from "./variants";

export * from "./variants";

type LineChartProps<T extends Record<string, unknown>> = {
  data: T[];
  categoryKey: string;
  series: ChartSeriesConfig[];
  /** Optional title rendered above the chart. */
  title?: string;
  /** Size preset — controls chart height. */
  size?: ChartSize;
  showGrid?: boolean;
  curved?: boolean;
};

export function LineChart<T extends Record<string, unknown>>({
  data,
  categoryKey,
  series,
  title,
  size = "md",
  showGrid = true,
  curved = true,
}: LineChartProps<T>) {
  const height = useChartHeight(size);
  const showLegend = series.length > 1;

  return (
    <Stack gap="sm" className={lineChartVariants()}>
      {title && <Heading size="sm">{title}</Heading>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          )}
          <XAxis
            dataKey={categoryKey}
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltipContent />} />
          {series.map((s, i) => (
            <Line
              key={s.dataKey}
              type={curved ? "monotone" : "linear"}
              dataKey={s.dataKey}
              name={s.label}
              stroke={chartColorByIndex(s.color ? s.color - 1 : i)}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
      {showLegend && (
        <ChartLegend items={series.map((s) => ({ label: s.label, color: s.color }))} />
      )}
    </Stack>
  );
}
