/**
 * charts/sparkline — a minimal inline trend line (no axes, grid, or tooltip).
 *
 * Lives on the `./charts` subpath so the core barrel stays free of the
 * charting runtime; pair it with surfaces that expose a chart slot
 * (e.g. StatCard's `chart` prop).
 */
import type { VariantProps } from "class-variance-authority";
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "../../lib/utils";
import { chartColor, chartColors, type ChartColorToken } from "../chartConfig";
import { sparklineVariants } from "./variants";

export * from "./variants";

export type SparklineProps = VariantProps<typeof sparklineVariants> & {
  /** The series, oldest first. Objects are unnecessary — it is one line. */
  data: number[];
  /** Semantic chart color (defaults to the primary chart slot). */
  color?: keyof typeof chartColors | ChartColorToken;
  className?: string;
};

export function Sparkline({ data, color = "primary", size, className }: SparklineProps) {
  const token = typeof color === "number" ? color : chartColors[color];
  const points = data.map((value, index) => ({ index, value }));

  return (
    <div className={cn(sparklineVariants({ size }), className)} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          {/* Give the line breathing room instead of clipping at the extremes. */}
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={chartColor(token)}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
