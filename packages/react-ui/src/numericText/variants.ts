import { cva } from "class-variance-authority";

export const numericTextVariants = cva("tabular-nums", {
  variants: {
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      success: "text-status-success",
      destructive: "text-destructive",
      warning: "text-status-warning",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-2xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
    weight: "normal",
  },
});
