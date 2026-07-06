import { cva } from "class-variance-authority";

export type DateTimeVariant =
  "date" | "date-short" | "datetime" | "time" | "date-range" | "month-year" | "relative";

export const dateTimeVariants = cva("font-mono tabular-nums tracking-tight", {
  variants: {
    variant: {
      date: "",
      "date-short": "",
      datetime: "",
      time: "",
      "date-range": "",
      "month-year": "",
      relative: "font-sans tracking-normal",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "date",
    tone: "default",
    size: "sm",
  },
});
