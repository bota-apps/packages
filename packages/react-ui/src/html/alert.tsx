/**
 * html/alert — variant-styled alert/message container <div>.
 *
 * Used by the Message component. Named "alert" to avoid collision with
 * the alert.tsx component file.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const alertVariants = cva("rounded-md border p-3 text-sm", {
  variants: {
    variant: {
      error: "bg-destructive/10 text-destructive border-destructive/30",
      success:
        "bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      warning:
        "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
      info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
      neutral: "bg-muted text-muted-foreground border-border",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

export type AlertElProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export const AlertEl = forwardRef<HTMLDivElement, AlertElProps>(function AlertEl(
  { variant, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(alertVariants({ variant }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* AlertTitleEl — bold title line inside an alert or message           */
/* ------------------------------------------------------------------ */

export const AlertTitleEl = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function AlertTitleEl(props, ref) {
    return <p ref={ref} className="mb-1 font-medium leading-none tracking-tight" {...props} />;
  },
);

/* ------------------------------------------------------------------ */
/* AlertDescriptionEl — description body inside an alert or message   */
/* ------------------------------------------------------------------ */

export const AlertDescriptionEl = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AlertDescriptionEl(props, ref) {
    return <div ref={ref} className="text-sm [&_p]:leading-relaxed" {...props} />;
  },
);
