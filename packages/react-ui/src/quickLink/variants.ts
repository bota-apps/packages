import { cva } from "class-variance-authority";

// The tile CVA lives in html/card — the styling source of truth for QuickLink itself.
export { tileVariants } from "../html/card";

/** Grid wrapper for QuickLink tiles — column count reacts to the grid's own container width. */
export const quickLinkGridVariants = cva("grid gap-3", {
  variants: {
    columns: {
      2: "grid-cols-1 @2xl:grid-cols-2",
      3: "grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3",
      4: "grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-4",
    },
  },
  defaultVariants: {
    columns: 3,
  },
});
