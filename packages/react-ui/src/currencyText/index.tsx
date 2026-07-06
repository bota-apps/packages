import { type VariantProps } from "class-variance-authority";
import type { Money } from "@bota-apps/types";
import { formatMoney, formatMoneyCompact, formatMoneyShort } from "@bota-apps/schema-utils";
import { cn } from "../lib/utils";
import { currencyTextVariants } from "./variants";

export * from "./variants";

const formatters = {
  short: formatMoneyShort,
  compact: formatMoneyCompact,
  full: formatMoney,
} as const;

type CurrencyFormat = keyof typeof formatters;

type CurrencyTextProps = VariantProps<typeof currencyTextVariants> & {
  value: Money;
  format?: CurrencyFormat;
  className?: string;
};

/**
 * Typography primitive for monetary values.
 *
 * Formats the value internally — no need to call `formatMoney*` at the call site.
 *
 * @example
 * <CurrencyText value={project.baseBudget} />
 * <CurrencyText size="xl" format="compact" value={project.totalBudget} />
 * <CurrencyText size="sm" tone="muted" format="full" value={entry.amount} />
 */
export function CurrencyText({
  size,
  tone,
  format = "short",
  className,
  value,
}: CurrencyTextProps) {
  return (
    <span className={cn(currencyTextVariants({ size, tone }), className)}>
      {formatters[format](value)}
    </span>
  );
}
