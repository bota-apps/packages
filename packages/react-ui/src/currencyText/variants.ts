import { cva } from "class-variance-authority";

export const currencyTextVariants = cva(
  "font-mono tabular-nums tracking-tight inline-flex items-baseline gap-1",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg font-semibold",
        xl: "text-2xl font-bold",
        "2xl": "text-3xl font-bold",
      },
      tone: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        success: "text-chart-2",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
    },
  },
);
