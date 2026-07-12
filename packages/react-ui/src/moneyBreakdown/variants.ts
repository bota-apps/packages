import { cva, type VariantProps } from "class-variance-authority";

/**
 * MoneyBreakdown emphasis — the weight a single row carries in a financial
 * summary. `default` is an ordinary line; `subtotal` closes a group with a
 * top rule; `total` is the grand total and reads boldest. Emphasis is never
 * color-only: it is expressed through weight and rules, and negative amounts
 * additionally carry a leading minus sign (a real character, not just a tint).
 */
export type MoneyBreakdownEmphasis = "default" | "subtotal" | "total";

/**
 * MoneyBreakdown root — a `@container` scope so the surface adapts to the panel
 * it sits in, not the viewport. Rows stack (label over value) in very narrow
 * containers and sit side by side (label … value) from `@xs` up. The `document`
 * variant frames the surface like a printed statement and prints cleanly.
 */
export const moneyBreakdownVariants = cva("@container w-full min-w-0 text-sm text-foreground", {
  variants: {
    variant: {
      default: "",
      document: "rounded-md border border-border bg-card p-4 print:rounded-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Group heading above a section's lines — quiet, uppercased eyebrow text. */
export const moneyBreakdownSectionTitleVariants = cva(
  "mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground",
);

/**
 * A single label/value row (a `<div>` grouping a `<dt>` and `<dd>` inside the
 * `<dl>`). Stacks below `@xs`, becomes a justified row above it. Emphasis adds
 * rules and spacing: `subtotal` a hairline top rule, `total` a heavier one plus
 * a larger type size. No interaction states — this is a read-only summary.
 */
export const moneyBreakdownRowVariants = cva(
  "flex flex-col gap-0.5 py-1 @xs:flex-row @xs:items-baseline @xs:justify-between @xs:gap-x-6",
  {
    variants: {
      emphasis: {
        default: "",
        subtotal: "mt-1 border-t border-border pt-2",
        total: "mt-2 border-t-2 border-foreground/60 pt-2 text-base",
      },
    },
    defaultVariants: {
      emphasis: "default",
    },
  },
);

/** The row's label cell (`<dt>`). Weight tracks emphasis; color stays readable. */
export const moneyBreakdownLabelVariants = cva("flex min-w-0 flex-col gap-0.5", {
  variants: {
    emphasis: {
      default: "",
      subtotal: "font-medium",
      total: "font-semibold",
    },
  },
  defaultVariants: {
    emphasis: "default",
  },
});

/**
 * The row's value cell (`<dd>`). Tabular figures keep digit columns aligned;
 * values right-align once the row is horizontal. `negative` tints the amount
 * destructive — the leading minus sign carries the meaning without it.
 */
export const moneyBreakdownValueVariants = cva(
  "tabular-nums whitespace-nowrap @xs:shrink-0 @xs:text-right",
  {
    variants: {
      emphasis: {
        default: "",
        subtotal: "font-medium",
        total: "font-semibold",
      },
      negative: {
        true: "text-destructive",
        false: "",
      },
    },
    defaultVariants: {
      emphasis: "default",
      negative: false,
    },
  },
);

export type MoneyBreakdownVariant = NonNullable<
  VariantProps<typeof moneyBreakdownVariants>["variant"]
>;
