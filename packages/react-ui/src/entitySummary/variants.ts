import { cva, type VariantProps } from "class-variance-authority";

/**
 * EntitySummary root — a `@container` scope so the fact grid reflows to its own
 * panel width, not the viewport. Column counts step up at container breakpoints.
 */
export const entitySummaryVariants = cva("@container w-full min-w-0");

/** The `<dl>` grid — 1 column in narrow panels, more as the container widens. */
export const entitySummaryGridVariants = cva("grid min-w-0", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 @xl:grid-cols-2",
      3: "grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3",
    },
    density: {
      comfortable: "gap-x-6 gap-y-4",
      compact: "gap-x-4 gap-y-2.5",
    },
  },
  defaultVariants: {
    columns: 2,
    density: "comfortable",
  },
});

/** A single label/value pair; `full` spans the whole row for long values. */
export const entitySummaryItemVariants = cva("flex min-w-0 flex-col gap-0.5", {
  variants: {
    full: {
      true: "col-span-full",
      false: "",
    },
  },
  defaultVariants: {
    full: false,
  },
});

export type EntitySummaryColumns = NonNullable<
  VariantProps<typeof entitySummaryGridVariants>["columns"]
>;
export type EntitySummaryDensity = NonNullable<
  VariantProps<typeof entitySummaryGridVariants>["density"]
>;
