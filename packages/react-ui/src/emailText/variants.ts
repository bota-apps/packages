import { cva } from "class-variance-authority";

export const emailTextVariants = cva("font-mono tracking-tight", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});
