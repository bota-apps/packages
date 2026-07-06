import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";
import { Stack } from "../../html/layout";
import { Heading } from "../../html/typography";
import {
  chartColorByIndex,
  formatChartValue,
  type ChartDataEntry,
  type ChartSize,
} from "../chartConfig";
import { useChartHeight } from "../useChartSize";
import { ChartTooltipContent } from "../chartTooltip";
import { ChartLegend } from "../chartLegend";
import { pieChartVariants } from "./variants";

export * from "./variants";

type PieChartProps = {
  data: ChartDataEntry[];
  /** Optional title rendered above the chart. */
  title?: string;
  /** Size preset — controls chart height. */
  size?: ChartSize;
  innerRadius?: number;
  /** Show a total value in the center of a donut chart. */
  centerLabel?: string;
  centerValue?: string | number;
  /** Value formatter for labels on slices. Default: number with locale separators. */
  formatValue?: (value: number) => string;
};

export function PieChart({
  data,
  title,
  size = "md",
  innerRadius = 0,
  centerLabel,
  centerValue,
  formatValue = formatChartValue,
}: PieChartProps) {
  const height = useChartHeight(size);
  const isDonut = innerRadius > 0;

  return (
    <Stack gap="sm" align="center" className={pieChartVariants()}>
      {title && <Heading size="sm">{title}</Heading>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={isDonut ? "55%" : 0}
            outerRadius="85%"
            label={isDonut ? undefined : renderValueLabel(formatValue)}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.label} fill={chartColorByIndex(entry.color ? entry.color - 1 : i)} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          {isDonut && centerValue !== undefined && (
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground text-xl font-bold"
            >
              {centerValue}
            </text>
          )}
          {isDonut && centerLabel && (
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground text-xs"
            >
              {centerLabel}
            </text>
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
      <ChartLegend items={data} />
    </Stack>
  );
}

/** Donut chart — PieChart with a center hole. Shows total in center by default. */
export function DonutChart({
  data,
  centerLabel,
  centerValue,
  ...rest
}: Omit<PieChartProps, "innerRadius"> & { title?: string }) {
  const total = centerValue ?? data.reduce((sum, d) => sum + d.value, 0);
  return (
    <PieChart
      {...rest}
      data={data}
      innerRadius={60}
      centerLabel={centerLabel}
      centerValue={total}
    />
  );
}

function renderValueLabel(formatValue: (v: number) => string) {
  return function ValueLabel({
    cx,
    cy,
    midAngle,
    outerRadius,
    value,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    value: number;
    percent: number;
  }) {
    if (percent < 0.05) {
      return null;
    }

    const radian = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * radian);
    const y = cy + radius * Math.sin(-midAngle * radian);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="fill-muted-foreground text-xs"
      >
        {formatValue(value)}
      </text>
    );
  };
}
