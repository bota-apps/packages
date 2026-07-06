import { cva } from "class-variance-authority";

/** Item row inside a section — interactive rows get pointer affordances. */
export const sectionListItemVariants = cva("", {
  variants: {
    interactive: {
      true: "cursor-pointer hover:bg-muted/50 transition-colors",
      false: "",
    },
    divided: {
      true: "border-b border-border/40",
      false: "",
    },
  },
  defaultVariants: {
    interactive: false,
    divided: false,
  },
});

/** Expand/collapse trigger for items with children — chevron rotates when closed. */
export const sectionListExpandTriggerVariants = cva(
  "flex w-full items-center gap-2 py-2 text-left cursor-pointer hover:bg-muted/50 transition-colors [&[data-state=closed]>svg]:-rotate-90 [&>svg]:shrink-0 [&>svg]:transition-transform",
);
