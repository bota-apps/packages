import { cva } from "class-variance-authority";

/** Wrapper around the card list — grid layout gets columns and gutters. */
export const dataTableCardListVariants = cva("", {
  variants: {
    layout: {
      list: "",
      grid: "grid grid-cols-2 md:grid-cols-3 gap-3 p-3",
    },
  },
  defaultVariants: {
    layout: "list",
  },
});

/** A single row card in list/grid layout. */
export const dataTableCardVariants = cva("", {
  variants: {
    layout: {
      list: "px-4 py-3 border-b border-border/50 last:border-b-0",
      grid: "rounded-md border p-3",
    },
    clickable: {
      true: "cursor-pointer",
    },
  },
  compoundVariants: [
    { layout: "list", clickable: true, class: "active:bg-muted/50" },
    { layout: "grid", clickable: true, class: "hover:bg-muted/50" },
  ],
  defaultVariants: {
    layout: "list",
  },
});
