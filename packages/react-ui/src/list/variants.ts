import { cva } from "class-variance-authority";

export const listItemVariants = cva("", {
  variants: {
    variant: {
      plain: "",
      divided: "py-2.5 border-b border-border/50 last:border-b-0",
    },
    clickable: {
      true: "cursor-pointer hover:bg-muted/50 transition-colors",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
});
