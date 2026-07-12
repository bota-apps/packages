import { cva, type VariantProps } from "class-variance-authority";
import type { BadgeVariant } from "../html/badge";

/**
 * ComparisonState — a per-column marker in a side-by-side option comparison.
 * `recommended`/`selected` also emphasize the whole column; `lowest`/`highest`
 * flag the extreme value across the compared set; `unavailable` marks an option
 * that cannot be chosen. None of these are ever color-only: each renders a Badge
 * with a text label (and icon), and selection carries `aria-pressed`.
 */
export type ComparisonState = "recommended" | "lowest" | "highest" | "selected" | "unavailable";

/**
 * Column emphasis level, derived from a column's states. `selected` wins over
 * `recommended`; everything else is `none`. Drives the tint on the header cell,
 * the body cells beneath it, and the stacked card in narrow containers.
 */
export const comparisonColumnVariants = cva("", {
  variants: {
    emphasis: {
      none: "",
      recommended: "bg-selected/40",
      selected: "bg-selected/70",
    },
  },
  defaultVariants: {
    emphasis: "none",
  },
});

export type ComparisonColumnEmphasis = NonNullable<
  VariantProps<typeof comparisonColumnVariants>["emphasis"]
>;

/**
 * ComparisonTable root — a `@container` scope so the table/card switch reacts to
 * the panel width, not the viewport. Below `@xl` the table hides and per-option
 * cards show; from `@xl` up the table shows and the cards hide.
 */
export const comparisonTableVariants = cva("@container w-full min-w-0");

/**
 * Header cell for a compared option. Emphasized columns gain a top accent border
 * and a tint; `unavailable` columns are dimmed. Transitions collapse to instant
 * under reduced motion.
 */
export const comparisonHeadCellVariants = cva(
  "align-top text-foreground transition-colors duration-fast ease-standard motion-reduce:transition-none border-t-2",
  {
    variants: {
      emphasis: {
        none: "border-t-transparent",
        recommended: "bg-selected/40 border-t-primary/50",
        selected: "bg-selected/70 border-t-primary",
      },
      unavailable: {
        true: "opacity-70",
        false: "",
      },
    },
    defaultVariants: {
      emphasis: "none",
      unavailable: false,
    },
  },
);

/** Body value cell — carries the same column tint as its header, plus dimming. */
export const comparisonBodyCellVariants = cva(
  "align-top transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      emphasis: {
        none: "",
        recommended: "bg-selected/40",
        selected: "bg-selected/70",
      },
      unavailable: {
        true: "opacity-70",
        false: "",
      },
    },
    defaultVariants: {
      emphasis: "none",
      unavailable: false,
    },
  },
);

/** Stacked per-option card shown in narrow containers (below `@xl`). */
export const comparisonCardVariants = cva(
  "rounded-lg border p-4 transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      emphasis: {
        none: "border-border",
        recommended: "border-primary/40 bg-selected/40",
        selected: "border-primary bg-selected/70 ring-1 ring-primary/40",
      },
      unavailable: {
        true: "opacity-70",
        false: "",
      },
    },
    defaultVariants: {
      emphasis: "none",
      unavailable: false,
    },
  },
);

/** Badge variant used to render each state marker — reuses the shared Badge. */
export const comparisonStateBadgeVariant: Record<ComparisonState, BadgeVariant> = {
  recommended: "success",
  lowest: "secondary",
  highest: "secondary",
  selected: "default",
  unavailable: "muted",
};

/** English default label per state; override via the `stateLabels` prop. */
export const comparisonStateDefaultLabels: Record<ComparisonState, string> = {
  recommended: "Recommended",
  lowest: "Lowest",
  highest: "Highest",
  selected: "Selected",
  unavailable: "Unavailable",
};
