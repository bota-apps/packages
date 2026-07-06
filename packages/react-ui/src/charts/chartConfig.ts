/**
 * Chart configuration types and theme utilities.
 *
 * Charts read colors from CSS variables (--chart-1 through --chart-8) defined
 * in the shared Tailwind theme, so they respect light/dark mode automatically.
 */

export type ChartColorToken = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Named chart color aliases for semantic use. */
export const chartColors = {
  primary: 1,
  success: 2,
  accent: 3,
  violet: 4,
  rose: 5,
  cyan: 6,
  amber: 7,
  green: 8,
} as const satisfies Record<string, ChartColorToken>;

export type ChartDataEntry = {
  label: string;
  value: number;
  color?: ChartColorToken;
};

export type ChartSeriesConfig = {
  dataKey: string;
  label: string;
  color?: ChartColorToken;
};

/** Chart size presets — matches the compact/default/feature Card variants. */
export type ChartSize = "sm" | "md" | "lg" | "responsive";

export const chartHeights: Record<Exclude<ChartSize, "responsive">, number> = {
  sm: 200,
  md: 280,
  lg: 360,
};

/**
 * Resolve a chart color token to the CSS variable string that Recharts accepts.
 * Recharts supports raw CSS color values, so we resolve via `hsl(var(--chart-N))`.
 */
export function chartColor(token: ChartColorToken): string {
  return `hsl(var(--chart-${token}))`;
}

/** Default palette — cycles through 8 chart tokens. */
export function chartColorByIndex(index: number): string {
  return chartColor(((index % 8) + 1) as ChartColorToken);
}

/** Format a number for display inside charts (compact for large values). */
export function formatChartValue(value: number): string {
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return value.toLocaleString();
}
