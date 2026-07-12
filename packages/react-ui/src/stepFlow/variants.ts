import { cva, type VariantProps } from "class-variance-authority";

/** StepFlow wrapper — the positioning context for the progress rail. */
export const stepFlowVariants = cva("relative");

/** The ordered list of steps; list styling reset, spacing owned per item. */
export const stepFlowListVariants = cva("m-0 list-none p-0");

/**
 * Rail track — a hairline behind the number chips, spanning from the first
 * chip's center to the last chip's center (chips are size-10, so centers sit
 * 1.25rem from each edge).
 */
export const stepFlowRailVariants = cva(
  "pointer-events-none absolute bottom-5 left-5 top-5 w-px bg-border",
);

/**
 * Rail fill — same geometry as the track, scaled by scroll progress from the
 * top. Transform-only so scrubbing stays on the compositor.
 */
export const stepFlowFillVariants = cva(
  "pointer-events-none absolute bottom-5 left-5 top-5 w-px origin-top bg-primary",
);

/** One step row: chip rail on the left, content to the right. */
export const stepFlowItemVariants = cva("relative flex gap-4 pb-10 last:pb-0");

/**
 * Number chip. Interaction-state tokens on purpose: `selected` marks the
 * step the reader is on, the primary fill marks steps already passed.
 */
export const stepFlowChipVariants = cva(
  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors duration-base ease-standard",
  {
    variants: {
      state: {
        upcoming: "border-border bg-background text-muted-foreground",
        active: "border-primary/40 bg-selected text-selected-foreground",
        done: "border-primary bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      state: "upcoming",
    },
  },
);

/** Step title row — title plus optional trailing aside, wrapping in narrow containers. */
export const stepFlowTitleRowVariants = cva("flex flex-wrap items-center gap-x-3 gap-y-1 pt-2");

/** Step title text. */
export const stepFlowTitleVariants = cva("font-medium leading-snug");

/** Step description text. */
export const stepFlowDescriptionVariants = cva("mt-1 text-sm text-muted-foreground");

export type StepFlowChipState = NonNullable<VariantProps<typeof stepFlowChipVariants>["state"]>;
