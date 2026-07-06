import { cva } from "class-variance-authority";
import { formControlWidths } from "../html/input";

export const dateRangeInputTriggerVariants = cva("justify-between font-normal", {
  variants: {
    width: formControlWidths,
  },
  defaultVariants: {
    width: "full",
  },
});
