/**
 * html/label — variant-styled <label> primitive.
 */
import { forwardRef, type LabelHTMLAttributes, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        /** Standard form field label. */
        default: "",
        /** Supplementary description beneath a field label. */
        description: "text-muted-foreground font-normal text-xs leading-relaxed mt-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type LabelElProps = LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants>;

export const LabelEl = forwardRef<HTMLLabelElement, LabelElProps>(function LabelEl(
  { variant, className, ...props },
  ref,
) {
  return <label ref={ref} className={cn(labelVariants({ variant }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* RadioOptionEl — label wrapping a radio input + option text          */
/* ------------------------------------------------------------------ */

/** Inline label for a radio group option — flex row with cursor-pointer. */
export const RadioOptionEl = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  function RadioOptionEl(props, ref) {
    return (
      <label ref={ref} className="flex items-center gap-2 text-sm cursor-pointer" {...props} />
    );
  },
);

/* ------------------------------------------------------------------ */
/* RadioInputEl — the actual <input type="radio"> with accent-primary  */
/* ------------------------------------------------------------------ */

/** <input type="radio"> styled with accent-primary. */
export const RadioInputEl = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function RadioInputEl(props, ref) {
    return <input ref={ref} type="radio" className="accent-primary" {...props} />;
  },
);
