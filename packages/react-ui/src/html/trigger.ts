/**
 * html/trigger — foundational cva for closed-state form-control trigger buttons
 * (select, combobox).
 */
import { cva } from "class-variance-authority";
import { formControlWidths } from "./input";
import { formControlInteractionClasses } from "./interaction";

/** Closed form-control trigger: bordered button showing the current value. */
export const formControlTriggerVariants = cva(
  [
    "flex h-9 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-raised placeholder:text-muted-foreground",
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
