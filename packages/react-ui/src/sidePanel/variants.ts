import { cva } from "class-variance-authority";

/** Width presets for the docked panel — applied from `md` up; below `md` the panel is viewport-wide. */
export const sidePanelWidths = ["md", "lg", "xl"] as const;
export type SidePanelWidth = (typeof sidePanelWidths)[number];

/** The `md`+ column width utility per preset — shared by standalone panels and the dock. */
export const sidePanelWidthClasses: Record<SidePanelWidth, string> = {
  md: "md:w-[26rem]",
  lg: "md:w-[34rem]",
  xl: "md:w-[42rem]",
};

/**
 * The panel column. Below `md` always a fixed, right-anchored overlay that
 * never exceeds the viewport width (small screens have no room to push
 * content aside). From `md` up, two presentations:
 * - standalone (`stacked: false`): an in-flow column meant to sit beside the
 *   content well — it pushes content instead of covering it, and sticks to
 *   the viewport while the document scrolls;
 * - inside a SidePanelDock (`stacked: true`): the dock owns the width,
 *   position, and card chrome; each open panel is a row sharing the column
 *   height, scrolling its own body.
 */
export const sidePanelVariants = cva(
  // Card surface, not the page background: the panel must read as its own
  // raised layer next to the content well, in every brand.
  "fixed inset-y-0 right-0 z-50 w-screen max-w-full border-l border-border bg-card text-card-foreground shadow-xl",
  {
    variants: {
      width: {
        md: "",
        lg: "",
        xl: "",
      },
      open: {
        true: "",
        false: "hidden",
      },
      stacked: {
        false: [
          "md:sticky md:top-0 md:z-auto md:max-h-dvh md:shrink-0 md:self-stretch md:shadow-overlay",
          "md:transition-[width] md:duration-200",
        ].join(" "),
        true: "md:static md:z-auto md:min-h-0 md:w-full md:max-w-full md:flex-1 md:basis-0 md:self-auto md:border-l-0 md:shadow-none",
      },
    },
    // The width presets only size a standalone panel — stacked panels fill
    // whatever width the dock is set to.
    compoundVariants: sidePanelWidths.map((width) => ({
      width,
      stacked: false as const,
      class: sidePanelWidthClasses[width],
    })),
    defaultVariants: { width: "md", open: true, stacked: false },
  },
);
