import { cva, type VariantProps } from "class-variance-authority";

/**
 * Stepper root — a container-query scope. Per-step labels hide below the
 * @2xl container width, where the compact "Step x of n" summary takes over,
 * so the stepper degrades gracefully in narrow panels regardless of viewport.
 */
export const stepperVariants = cva("@container w-full", {
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
