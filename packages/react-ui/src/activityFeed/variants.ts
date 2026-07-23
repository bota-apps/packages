import { cva, type VariantProps } from "class-variance-authority";

/**
 * ActivityFeed tone — colors an entry's marker chip. A human-readable feed of
 * things that happened (distinct from a compliance audit log). Tones use theme
 * tokens; `primary` uses the `selected` emphasis, never `accent`.
 */
export const activityFeedMarkerVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-selected text-selected-foreground",
        success: "bg-status-success/15 text-status-success",
        warning: "bg-status-warning/15 text-status-warning",
        destructive: "bg-destructive/15 text-destructive",
      },
      density: {
        comfortable: "h-7 w-7 [&_svg]:size-3.5",
        compact: "h-6 w-6 [&_svg]:size-3",
      },
    },
    defaultVariants: {
      tone: "default",
      density: "comfortable",
    },
  },
);

/** Solid inner dot for entries with no icon, tinted to match the marker tone. */
export const activityFeedDotVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    tone: {
      default: "bg-muted-foreground",
      primary: "bg-primary",
      success: "bg-status-success",
      warning: "bg-status-warning",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

/** ActivityFeed root — a vertical `<ol>`. */
export const activityFeedVariants = cva("flex flex-col");

/**
 * A feed entry `<li>` — its `::before` draws the connecting rail below the
 * marker; the last entry hides it. Offsets center the line under the marker at
 * each density. `showConnectors={false}` hides the rail entirely.
 */
export const activityFeedItemVariants = cva(
  "relative flex gap-3 before:absolute before:bottom-0 before:w-px before:-translate-x-1/2 before:bg-border last:before:hidden",
  {
    variants: {
      density: {
        comfortable: "pb-5 before:left-3.5 before:top-8",
        compact: "pb-3 before:left-3 before:top-7",
      },
    },
    defaultVariants: {
      density: "comfortable",
    },
  },
);

export type ActivityFeedTone = NonNullable<VariantProps<typeof activityFeedMarkerVariants>["tone"]>;
export type ActivityFeedDensity = NonNullable<
  VariantProps<typeof activityFeedMarkerVariants>["density"]
>;
