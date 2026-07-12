import { cva, type VariantProps } from "class-variance-authority";

/**
 * Container-responsive two-column dashboard grid. The grid reacts to its own
 * container width (OperationalDashboard renders the `@container` wrapper), so a
 * dashboard placed in a narrow panel stays single-column even on a wide viewport.
 * `ratio` sets the wide-container column proportion; the base is always a single
 * column so the layout is stable with no reflow between the two states.
 */
export const operationalDashboardVariants = cva("grid grid-cols-1", {
  variants: {
    ratio: {
      balanced: "@xl:grid-cols-2",
      primary: "@xl:grid-cols-[2fr_1fr]",
      secondary: "@xl:grid-cols-[1fr_2fr]",
    },
    gap: {
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    ratio: "balanced",
    gap: "lg",
  },
});

export type OperationalDashboardVariants = VariantProps<typeof operationalDashboardVariants>;
export type OperationalDashboardRatio = NonNullable<OperationalDashboardVariants["ratio"]>;
export type OperationalDashboardGap = NonNullable<OperationalDashboardVariants["gap"]>;
