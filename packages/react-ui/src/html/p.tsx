/**
 * html/p — variant-styled <p> primitives.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const pVariants = cva("", {
  variants: {
    variant: {
      body: "text-sm",
      muted: "text-sm text-muted-foreground",
      label: "text-sm font-medium",
      description: "text-sm text-muted-foreground",
      caption: "text-xs text-muted-foreground",
      /** Inline title inside an Alert or Message — bold short label line. */
      alertTitle: "mb-1 font-medium leading-none tracking-tight",
      /** Error message — destructive red. Used for form validation feedback. */
      error: "text-sm font-medium text-destructive",
    },
    truncate: {
      true: "truncate",
    },
    /** Top margin variants — for spacing below a sibling element. */
    mt: {
      "1": "mt-1",
    },
  },
});

export type PProps = HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof pVariants>;

export const P = forwardRef<HTMLParagraphElement, PProps>(function P(
  { variant, truncate, mt, className, ...props },
  ref,
) {
  return <p ref={ref} className={cn(pVariants({ variant, truncate, mt }), className)} {...props} />;
});
