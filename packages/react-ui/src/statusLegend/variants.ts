import { cva, type VariantProps } from "class-variance-authority";

/**
 * StatusLegend tone — the swatch color for a legend entry. Matches the token
 * palette used by markers/timelines so a legend and the thing it explains read
 * as one system. Color is never the sole signal (entries also carry a label,
 * and may carry an icon for shape redundancy).
 */
export const statusLegendSwatchVariants = cva(
  "flex shrink-0 items-center justify-center rounded-full [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-selected text-selected-foreground",
        success: "bg-status-success/15 text-status-success",
        warning: "bg-status-warning/15 text-status-warning",
        destructive: "bg-destructive/15 text-destructive",
        muted: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "sm",
    },
  },
);

/** Solid inner dot for entries with no icon, tinted to match the swatch tone. */
export const statusLegendDotVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    tone: {
      default: "bg-muted-foreground",
      primary: "bg-primary",
      success: "bg-status-success",
      warning: "bg-status-warning",
      destructive: "bg-destructive",
      muted: "bg-muted-foreground",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

/** StatusLegend root — a wrapping row, or a stacked column. */
export const statusLegendVariants = cva("flex min-w-0", {
  variants: {
    orientation: {
      horizontal: "flex-row flex-wrap items-center gap-x-4 gap-y-1.5",
      vertical: "flex-col gap-1.5",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type StatusLegendTone = NonNullable<VariantProps<typeof statusLegendSwatchVariants>["tone"]>;
export type StatusLegendOrientation = NonNullable<
  VariantProps<typeof statusLegendVariants>["orientation"]
>;
