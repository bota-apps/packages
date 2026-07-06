import { cva, type VariantProps } from "class-variance-authority";

export const statCardVariants = cva("rounded-lg border shadow-sm flex items-center", {
  variants: {
    /** Visual style. `outlined` = left border accent. `filled` = tinted background. */
    variant: {
      default: "bg-card",
      outlined: "bg-card border-l-[3px]",
      filled: "border-transparent",
    },
    tone: {
      default: "",
      success: "",
      warning: "",
      info: "",
      destructive: "",
    },
    /** Card density. `sm` = compact for dense grids. `lg` = hero stats. */
    size: {
      sm: "p-2 gap-2",
      default: "p-3 gap-3",
      lg: "p-4 gap-4",
    },
    interactive: {
      true: "cursor-pointer hover:shadow-md hover:border-primary/30 transition-all",
      false: "",
    },
  },
  compoundVariants: [
    // `outlined` colors the left border accent by tone.
    { variant: "outlined", tone: "default", className: "border-l-primary" },
    { variant: "outlined", tone: "success", className: "border-l-emerald-500" },
    { variant: "outlined", tone: "warning", className: "border-l-amber-500" },
    { variant: "outlined", tone: "info", className: "border-l-blue-500" },
    { variant: "outlined", tone: "destructive", className: "border-l-destructive" },
    // `filled` tints the background by tone.
    { variant: "filled", tone: "default", className: "bg-primary/5" },
    { variant: "filled", tone: "success", className: "bg-emerald-500/5" },
    { variant: "filled", tone: "warning", className: "bg-amber-500/5" },
    { variant: "filled", tone: "info", className: "bg-blue-500/5" },
    { variant: "filled", tone: "destructive", className: "bg-destructive/5" },
  ],
  defaultVariants: {
    variant: "default",
    tone: "default",
    size: "default",
    interactive: false,
  },
});

export const statCardIconVariants = cva("flex shrink-0 items-center justify-center rounded-full", {
  variants: {
    tone: {
      default: "bg-primary/10 text-primary",
      success: "bg-emerald-500/10 text-emerald-500",
      warning: "bg-amber-500/10 text-amber-500",
      info: "bg-blue-500/10 text-blue-500",
      destructive: "bg-destructive/10 text-destructive",
    },
    size: {
      sm: "h-7 w-7",
      default: "h-9 w-9",
      lg: "h-10 w-10",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "default",
  },
});

export type StatCardTone = NonNullable<VariantProps<typeof statCardVariants>["tone"]>;
export type StatCardVariant = NonNullable<VariantProps<typeof statCardVariants>["variant"]>;
export type StatCardSize = NonNullable<VariantProps<typeof statCardVariants>["size"]>;
