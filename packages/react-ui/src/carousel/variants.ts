import { cva, type VariantProps } from "class-variance-authority";

/**
 * Root wrapper around the stage and the pager. Carries the module's
 * `@container` scope — descendants adapt to this element's width, never the
 * viewport. The wrapper itself must stay free of `@…:` variants.
 */
export const carouselVariants = cva("@container flex w-full flex-col gap-2");

/**
 * Fixed-height centered stage the active slide fills. The viewport-height cap
 * keeps the stage usable both inline and inside dialog chrome.
 */
export const carouselStageVariants = cva(
  "flex items-center justify-center overflow-hidden rounded-md border border-input bg-muted",
  {
    variants: {
      size: {
        sm: "h-64",
        default: "h-[min(60dvh,36rem)]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type CarouselStageVariantProps = VariantProps<typeof carouselStageVariants>;
export type CarouselStageSize = NonNullable<CarouselStageVariantProps["size"]>;

/** One slide, centered within the stage. */
export const carouselSlideVariants = cva("flex h-full w-full items-center justify-center");

/** Slide image — letterboxed to fit the stage, never cropped. */
export const carouselImageVariants = cva("max-h-full max-w-full object-contain");

/** Pager row (previous / position / next), centered under the stage. */
export const carouselFooterVariants = cva("flex items-center justify-center gap-1");

/** "n of m" position readout between the pager buttons. */
export const carouselPositionVariants = cva(
  "min-w-14 text-center text-sm tabular-nums text-muted-foreground",
);
