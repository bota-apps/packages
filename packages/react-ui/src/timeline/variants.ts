import { cva, type VariantProps } from "class-variance-authority";

/** Timeline root — a vertical <ol>; spacing between entries comes from each item. */
export const timelineVariants = cva("flex flex-col");

/**
 * Timeline item — a relative <li> whose ::before draws the connector line
 * from just below the marker down to the bottom of the row. The last item
 * hides its connector so the rail visibly ends at the final marker.
 */
export const timelineItemVariants = cva(
  "relative flex gap-3 pb-8 last:pb-0 before:absolute before:bottom-0 before:left-3 before:top-8 before:w-px before:-translate-x-1/2 before:bg-border last:before:hidden",
);

/**
 * Circular marker chip on the rail. Holds the entry's icon, or the solid
 * dot when no icon is given. Tones use theme tokens (soft tint surfaces) —
 * `selected` for primary emphasis, never `accent`.
 */
export const timelineMarkerVariants = cva(
  "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-raised transition-colors duration-fast ease-standard [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-selected text-selected-foreground",
        success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        destructive: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

/** Solid inner dot rendered inside the marker chip when an item has no icon. */
export const timelineDotVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    tone: {
      default: "bg-muted-foreground",
      primary: "bg-primary",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

/** Timestamp / secondary meta text beside the entry title. */
export const timelineMetaVariants = cva("shrink-0 text-xs text-muted-foreground");

export type TimelineTone = NonNullable<VariantProps<typeof timelineMarkerVariants>["tone"]>;
