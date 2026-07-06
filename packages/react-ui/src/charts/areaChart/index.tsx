import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
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
import { areaChartVariants } from "./variants";

export * from "./variants";

type AreaChartProps<T extends Record<string, unknown>> = {
  data: T[];
  categoryKey: string;
  series: ChartSeriesConfig[];
  /** Optional title rendered above the chart. */
  title?: string;
  /** Size preset — controls chart height. */
  size?: ChartSize;
  stacked?: boolean;
  showGrid?: boolean;
};

export function AreaChart<T extends Record<string, unknown>>({
  data,
  categoryKey,
  series,
  title,
  size = "md",
  stacked = false,
  showGrid = true,
}: AreaChartProps<T>) {
  const height = useChartHeight(size);
  const showLegend = series.length > 1;

  return (
    <Stack gap="sm" className={areaChartVariants()}>
      {title && <Heading size="sm">{title}</Heading>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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
          {series.map((s, i) => {
            const color = chartColorByIndex(s.color ? s.color - 1 : i);
            return (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.label}
                stroke={color}
                fill={color}
                fillOpacity={0.15}
                strokeWidth={2}
                stackId={stacked ? "stack" : undefined}
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
      {showLegend && (
        <ChartLegend items={series.map((s) => ({ label: s.label, color: s.color }))} />
      )}
    </Stack>
  );
}
