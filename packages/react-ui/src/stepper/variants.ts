import { cva, type VariantProps } from "class-variance-authority";

export const stepperVariants = cva("flex w-full", {
  variants: {
    maxWidth: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
    },
  },
});

export type StepperVariantProps = VariantProps<typeof stepperVariants>;

/** Connector line segment, colored to match the adjacent step bubble's state. */
export const stepperLineVariants = cva("h-0.5 flex-1", {
  variants: {
    state: {
      upcoming: "bg-border",
      warning: "bg-amber-500/40",
      success: "bg-emerald-500/40",
      info: "bg-blue-500/40",
      active: "bg-primary/40",
      done: "bg-primary/40",
    },
  },
  defaultVariants: {
    state: "upcoming",
  },
});
