import { cva } from "class-variance-authority";

/**
 * Container-responsive column layout for FormGrid. Columns react to the
 * grid's own container width (FormGrid renders the `@container` wrapper),
 * so a form in a narrow panel stays single-column even on a wide viewport.
 */
export const formGridVariants = cva("", {
  variants: {
    columns: {
      2: "grid-cols-1 @xl:grid-cols-2",
      3: "grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3",
    },
  },
  defaultVariants: { columns: 2 },
});
