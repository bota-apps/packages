import { cva } from "class-variance-authority";

/** Menu item styling — destructive actions get destructive text coloring. */
export const pageMenuActionItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      destructive: "text-destructive focus:text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
