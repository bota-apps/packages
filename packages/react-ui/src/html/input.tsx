/**
 * html/input — styled <input> primitive.
 */
import { forwardRef, type InputHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { formControlInteractionClasses } from "./interaction";

/** Width options shared by form controls (input, select/combobox triggers). */
export const formControlWidths = {
  full: "w-full",
  auto: "min-w-[12rem] flex-1",
};

export const inputVariants = cva(
  [
    // bg-background (not transparent): recessed-well reading on elevated
    // surfaces — see html/trigger.ts.
    "flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-raised file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
    formControlInteractionClasses,
  ],
  {
    variants: {
      width: formControlWidths,
    },
    defaultVariants: {
      width: "full",
    },
  },
);

export type InputElProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Width behavior: "full" (default) stretches to container, "auto" sizes to content (for inline/filter layouts) */
  width?: "full" | "auto";
};

export const InputEl = forwardRef<HTMLInputElement, InputElProps>(function InputEl(
  { className, width = "full", ...props },
  ref,
) {
  return <input ref={ref} className={cn(inputVariants({ width }), className)} {...props} />;
});
