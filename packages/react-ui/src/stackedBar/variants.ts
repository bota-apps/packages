import { cva } from "class-variance-authority";

export const stackedBarVariants = cva("flex w-full gap-0.5 overflow-hidden rounded-full", {
  variants: {
    height: {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
    },
  },
  defaultVariants: { height: "md" },
});
