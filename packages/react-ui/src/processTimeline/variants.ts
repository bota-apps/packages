import { cva, type VariantProps } from "class-variance-authority";

/**
 * ProcessTimeline status — the lifecycle position of a single step. Ordering
 * is meaningful (`complete` → `current` → `upcoming`), and `blocked`/`skipped`
 * are terminal off-path states. Colors alone never carry this meaning: each
 * status also has a default marker icon (shape) and a visually-hidden label.
 */
export type ProcessTimelineItemStatus = "complete" | "current" | "upcoming" | "blocked" | "skipped";

/**
 * ProcessTimeline root — a `@container` scope so the timeline adapts to its
 * panel width, not the viewport. Horizontal timelines consult this to hide
 * per-step labels below `@2xl` in favor of a compact summary (mirrors Stepper).
 */
export const processTimelineVariants = cva("@container w-full min-w-0");

/** The `<ol>` rail — column in vertical orientation, row in horizontal. */
export const processTimelineListVariants = cva("flex list-none min-w-0", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

/**
 * A vertical `<li>` — its `::before` draws the connector below the marker,
 * colored by *this* item's status (the segment carrying progress to the next
 * step). The last item hides its connector so the rail ends at the final
 * marker. Left/top offsets center the line under the density-sized marker.
 */
export const processTimelineVerticalItemVariants = cva(
  "relative min-w-0 before:absolute before:bottom-0 before:w-px before:-translate-x-1/2 last:before:hidden before:transition-colors before:duration-fast before:ease-standard motion-reduce:before:transition-none",
  {
    variants: {
      status: {
        complete: "before:bg-primary",
        current: "before:bg-primary/40",
        upcoming: "before:bg-border",
        blocked: "before:bg-destructive/40",
        skipped: "before:bg-border",
      },
      density: {
        comfortable: "pb-6 before:left-4 before:top-9",
        compact: "pb-4 before:left-3 before:top-7",
      },
    },
    defaultVariants: {
      status: "upcoming",
      density: "comfortable",
    },
  },
);

/**
 * The row inside a vertical item — marker + body. Becomes a full-width button
 * when the timeline is interactive, taking the shared focus ring, a transient
 * `muted` hover surface, and a persistent `selected` tint when chosen.
 */
export const processTimelineRowVariants = cva("flex w-full min-w-0 gap-3 rounded-md text-left", {
  variants: {
    interactive: {
      true: "cursor-pointer px-2 -mx-2 py-1 transition-colors duration-fast ease-standard hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 motion-reduce:transition-none",
      false: "",
    },
    selected: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [{ interactive: true, selected: true, class: "bg-selected hover:bg-selected" }],
  defaultVariants: {
    interactive: false,
    selected: false,
  },
});

/**
 * Circular marker chip. `complete` reads as a solid, done fill; `current` uses
 * the `selected` tokens plus a soft primary ring for "you are here"; the rest
 * are quiet tints. `skipped` is a dashed hollow chip. Never uses `accent`.
 */
export const processTimelineMarkerVariants = cva(
  "relative z-10 mt-0.5 flex shrink-0 items-center justify-center rounded-full border transition-colors duration-fast ease-standard motion-reduce:transition-none [&_svg]:shrink-0",
  {
    variants: {
      status: {
        complete: "border-primary bg-primary text-primary-foreground",
        current: "border-primary bg-selected text-selected-foreground ring-2 ring-primary/30",
        upcoming: "border-border bg-muted text-muted-foreground",
        blocked: "border-destructive/40 bg-destructive/15 text-destructive",
        skipped: "border-dashed border-border bg-transparent text-muted-foreground",
      },
      density: {
        comfortable: "h-8 w-8 [&_svg]:size-4",
        compact: "h-6 w-6 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      status: "upcoming",
      density: "comfortable",
    },
  },
);

/** Solid inner dot for `current`/`upcoming` markers that carry no icon. */
export const processTimelineDotVariants = cva("rounded-full", {
  variants: {
    status: {
      complete: "bg-primary-foreground",
      current: "bg-primary",
      upcoming: "bg-muted-foreground",
      blocked: "bg-destructive",
      skipped: "bg-muted-foreground",
    },
    density: {
      comfortable: "h-2 w-2",
      compact: "h-1.5 w-1.5",
    },
  },
  defaultVariants: {
    status: "upcoming",
    density: "comfortable",
  },
});

/** Connector segment in a horizontal timeline, colored by its step's status. */
export const processTimelineConnectorVariants = cva(
  "h-0.5 flex-1 transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      status: {
        complete: "bg-primary",
        current: "bg-primary/40",
        upcoming: "bg-border",
        blocked: "bg-destructive/40",
        skipped: "bg-border",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  },
);

export type ProcessTimelineOrientation = NonNullable<
  VariantProps<typeof processTimelineListVariants>["orientation"]
>;
export type ProcessTimelineDensity = NonNullable<
  VariantProps<typeof processTimelineMarkerVariants>["density"]
>;
