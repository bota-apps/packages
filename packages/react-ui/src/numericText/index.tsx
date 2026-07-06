import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { numericTextVariants } from "./variants";

export * from "./variants";

type NumericVariant = "count" | "percent" | "ordinal";

type NumericTextProps = VariantProps<typeof numericTextVariants> & {
  value: number;
  variant?: NumericVariant;
  /** Number of decimal places for "percent" variant. Default: 1. */
  decimals?: number;
};

const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });
const ordinalSuffixes: Record<string, string> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

function formatNumeric(value: number, variant: NumericVariant, decimals: number): string {
  switch (variant) {
    case "count":
      return value.toLocaleString("en");
    case "percent":
      return `${value.toFixed(decimals)}%`;
    case "ordinal": {
      const rule = ordinalRules.select(value);
      const suffix = ordinalSuffixes[rule] ?? "th";
      return `${value}${suffix}`;
    }
  }
}

/**
 * Consistent display for non-monetary numbers (counts, percentages, ordinals).
 *
 * Uses `tabular-nums` for digit stability without the monospace treatment
 * used by `CurrencyText`. Differentiates counts from money visually.
 *
 * @example
 * <NumericText value={27} variant="count" />
 * <NumericText value={12.5} variant="percent" tone="success" />
 * <NumericText value={3} variant="ordinal" />
 */
export function NumericText({
  value,
  variant = "count",
  decimals = 1,
  tone = "default",
  size = "md",
  weight = "normal",
}: NumericTextProps) {
  const formatted = formatNumeric(value, variant, decimals);
  return <span className={cn(numericTextVariants({ tone, size, weight }))}>{formatted}</span>;
}
