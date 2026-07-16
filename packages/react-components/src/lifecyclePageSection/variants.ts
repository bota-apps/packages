import { cva } from "class-variance-authority";

/**
 * Root scope for the section. Establishes a container-query context so the
 * body's two-column split reacts to this section's own width, not the viewport.
 */
export const lifecyclePageSectionVariants = cva("@container");

/**
 * Timeline + optional detail-panel layout.
 *
 * - `single` keeps a single column (timeline only).
 * - `split` places the detail panel beside the timeline once the container is
 *   wide enough (`@xl`) and stacks them below that width. Column widths are
 *   fixed (`minmax` tracks) and items align to the top so the layout never
 *   shifts as the slotted content changes.
 */
export const lifecyclePageSectionBodyVariants = cva("grid gap-6", {
  variants: {
    layout: {
      single: "",
      split: "items-start @xl:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]",
    },
  },
  defaultVariants: {
    layout: "single",
  },
});
