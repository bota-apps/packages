import { cva, type VariantProps } from "class-variance-authority";

export const statCardVariants = cva(
  "@container rounded-lg border shadow-raised flex items-center",
  {
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
        true: "cursor-pointer hover:shadow-overlay hover:border-primary/30 transition-all duration-base ease-standard",
        false: "",
      },
    },
    compoundVariants: [
      // `outlined` colors the left border accent by tone.
      { variant: "outlined", tone: "default", className: "border-l-primary" },
      { variant: "outlined", tone: "success", className: "border-l-status-success" },
      { variant: "outlined", tone: "warning", className: "border-l-status-warning" },
      { variant: "outlined", tone: "info", className: "border-l-status-info" },
      { variant: "outlined", tone: "destructive", className: "border-l-destructive" },
      // `filled` tints the background by tone.
      { variant: "filled", tone: "default", className: "bg-primary/5" },
      { variant: "filled", tone: "success", className: "bg-status-success/5" },
      { variant: "filled", tone: "warning", className: "bg-status-warning/5" },
      { variant: "filled", tone: "info", className: "bg-status-info/5" },
      { variant: "filled", tone: "destructive", className: "bg-destructive/5" },
    ],
    defaultVariants: {
      variant: "default",
      tone: "default",
      size: "default",
      interactive: false,
    },
  },
);

export type StatCardTone = NonNullable<VariantProps<typeof statCardVariants>["tone"]>;
export type StatCardVariant = NonNullable<VariantProps<typeof statCardVariants>["variant"]>;
export type StatCardSize = NonNullable<VariantProps<typeof statCardVariants>["size"]>;
