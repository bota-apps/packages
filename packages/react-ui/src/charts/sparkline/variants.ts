import { cva } from "class-variance-authority";

/** Inline trend container — sized by the caller's slot, never the viewport. */
export const sparklineVariants = cva("pointer-events-none select-none", {
  variants: {
    size: {
      sm: "h-8 w-20",
      default: "h-10 w-28",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
