/**
 * html/trigger — foundational cva for closed-state form-control trigger buttons
 * (select, combobox).
 */
import { cva } from "class-variance-authority";
import { formControlWidths } from "./input";

/** Closed form-control trigger: bordered button showing the current value. */
export const formControlTriggerVariants = cva(
  "flex h-9 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      width: formControlWidths,
    },
    defaultVariants: {
      width: "full",
    },
  },
);
