import { cva } from "class-variance-authority";
import { buttonVariants } from "../button";

/**
 * Styling for the confirm action button. The default variant adds nothing on
 * top of AlertDialogAction's built-in button styling; the destructive variant
 * layers the destructive button classes over it.
 */
export const confirmDialogActionVariants = cva("", {
  variants: {
    variant: {
      default: "",
      destructive: buttonVariants({ variant: "destructive" }),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
