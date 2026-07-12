import { cva, type VariantProps } from "class-variance-authority";

/**
 * Base container classes for the waterfall chart. Thin by design — the chart
 * itself is a Recharts wrapper and styles its internals via theme classes/CSS
 * vars. The `variant` toggles plot density (value labels, tick sizing) from the
 * component; the container class stays minimal.
 */
export const waterfallChartVariants = cva("w-full", {
  variants: {
    variant: {
      standard: "",
      compact: "",
    },
  },
  defaultVariants: { variant: "standard" },
});

export type WaterfallChartVariantProps = VariantProps<typeof waterfallChartVariants>;
