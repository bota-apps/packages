import { cva } from "class-variance-authority";

/** Width presets for the docked panel — applied from `md` up; below `md` the panel is viewport-wide. */
export const sidePanelWidths = ["md", "lg", "xl"] as const;
export type SidePanelWidth = (typeof sidePanelWidths)[number];

/**
 * The panel column. Two presentations from one element:
 * - below `md`: a fixed, right-anchored overlay that never exceeds the
 *   viewport width (small screens have no room to push content aside);
 * - from `md` up: an in-flow column meant to sit beside the content well —
 *   it pushes content instead of covering it, and sticks to the viewport
 *   while the document scrolls.
 */
export const sidePanelVariants = cva(
  [
    // Card surface, not the page background: the panel must read as its own
    // raised layer next to the content well, in every brand.
    "fixed inset-y-0 right-0 z-50 w-screen max-w-full border-l border-border bg-card text-card-foreground shadow-xl",
    "md:sticky md:top-0 md:z-auto md:max-h-dvh md:shrink-0 md:self-stretch md:shadow-overlay",
    "md:transition-[width] md:duration-200",
  ].join(" "),
  {
    variants: {
      width: {
        md: "md:w-[26rem]",
        lg: "md:w-[34rem]",
        xl: "md:w-[42rem]",
      },
      open: {
        true: "",
        false: "hidden",
      },
    },
    defaultVariants: { width: "md", open: true },
  },
);
