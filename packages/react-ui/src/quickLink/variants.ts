import { cva } from "class-variance-authority";

// The tile CVA lives in html/card — the styling source of truth for QuickLink itself.
export { tileVariants } from "../html/card";

/** Grid wrapper for QuickLink tiles — column count is responsive. */
export const quickLinkGridVariants = cva("grid gap-3", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    columns: 3,
  },
});
