import { cva } from "class-variance-authority";

export const phoneTextVariants = cva("font-mono tabular-nums tracking-wide", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});
