import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { Stack } from "../../html/layout";
import { Heading } from "../../html/typography";
import {
  chartColorByIndex,
  formatChartValue,
  type ChartSeriesConfig,
  type ChartSize,
} from "../chartConfig";
import { useChartHeight } from "../useChartSize";
import { ChartTooltipContent } from "../chartTooltip";
import { ChartLegend } from "../chartLegend";
import { barChartVariants } from "./variants";

export * from "./variants";

type BarChartProps<T extends Record<string, unknown>> = {
  data: T[];
  categoryKey: string;
  series: ChartSeriesConfig[];
  /** Optional title rendered above the chart. */
  title?: string;
  /** Size preset — controls chart height. */
  size?: ChartSize;
  layout?: "vertical" | "horizontal";
  stacked?: boolean;
  showGrid?: boolean;
  /** Show value labels on each bar. */
  showValues?: boolean;
  /** Value formatter for bar labels. */
  formatValue?: (value: number) => string;
  /** Width of the Y-axis label area for vertical layout. Default: 120. */
  yAxisWidth?: number;
};

export function BarChart<T extends Record<string, unknown>>({
  data,
  categoryKey,
  series,
  title,
  size = "md",
  layout = "horizontal",
  stacked = false,
  showGrid = true,
  showValues = false,
  formatValue,
  yAxisWidth,
}: BarChartProps<T>) {
  const isVertical = layout === "vertical";
  const height = useChartHeight(size);
  const showLegend = series.length > 1;

  return (
    <Stack gap="sm" className={barChartVariants()}>
      {title && <Heading size="sm">{title}</Heading>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={isVertical ? "vertical" : "horizontal"}
          margin={{ top: 8, right: showValues ? 40 : 8, bottom: 8, left: 8 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          )}
          {isVertical ? (
            <>
              <YAxis
                dataKey={categoryKey}
                type="category"
                width={yAxisWidth ?? 120}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
            </>
          ) : (
            <>
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
            </>
          )}
          <Tooltip content={<ChartTooltipContent />} />
          {series.map((s, i) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.label}
              fill={chartColorByIndex(s.color ? s.color - 1 : i)}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? "stack" : undefined}
            >
              {showValues && (
                <LabelList
                  dataKey={s.dataKey}
                  position={isVertical ? "right" : "top"}
                  className="fill-muted-foreground text-xs"
                  formatter={formatValue ?? formatChartValue}
                />
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
      {showLegend && (
        <ChartLegend items={series.map((s) => ({ label: s.label, color: s.color }))} />
      )}
    </Stack>
  );
}
