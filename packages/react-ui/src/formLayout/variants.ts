import { cva } from "class-variance-authority";

/** Responsive column layout for FormGrid. */
export const formGridVariants = cva("", {
  variants: {
    columns: {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: { columns: 2 },
});
