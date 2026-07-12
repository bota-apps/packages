import { cva, type VariantProps } from "class-variance-authority";

/**
 * RouteDiagram status — the progress position of a single node or leg along a
 * staged journey. `complete` → `current` → `upcoming` reads as travelled →
 * here → ahead. Colour never carries this alone: nodes also differ in *shape*
 * (a solid checked disc, a ringed "you are here" target, a hollow outline) and
 * every position is spelled out in text (a visible caption on the diagram plus
 * the semantic legs summary).
 */
export type RouteStatus = "complete" | "current" | "upcoming";

/**
 * RouteDiagram root — a `@container` scope so the diagram adapts to its own
 * panel width, not the viewport. A horizontal route consults this to fall back
 * to a stacked vertical layout below `@md`, where a single row would overflow.
 */
export const routeDiagramVariants = cva("@container w-full min-w-0");

/**
 * Node marker fill/stroke by status, applied to the outer SVG `<circle>`.
 * `complete` is a solid primary disc, `current` a hollow primary-ringed target,
 * `upcoming` a quiet border outline. Never uses `accent`.
 */
export const routeNodeVariants = cva(
  "transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      status: {
        complete: "fill-primary stroke-primary",
        current: "fill-background stroke-primary",
        upcoming: "fill-background stroke-border",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  },
);

/** Leg segment stroke by status, applied to the connecting SVG `<line>`. */
export const routeLegVariants = cva(
  "transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      status: {
        complete: "stroke-primary",
        current: "stroke-primary",
        upcoming: "stroke-border",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  },
);

export type RouteNodeStatus = NonNullable<VariantProps<typeof routeNodeVariants>["status"]>;
export type RouteLegStatus = NonNullable<VariantProps<typeof routeLegVariants>["status"]>;
