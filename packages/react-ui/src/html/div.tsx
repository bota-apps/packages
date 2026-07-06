/**
 * html/div — variant-styled <div> primitives.
 *
 * Every semantic use of <div> in react-ui maps to one of these variants
 * so raw <div> tags live only here.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const divVariants = cva("", {
  variants: {
    /** Layout patterns */
    layout: {
      row: "flex items-center",
      rowBetween: "flex items-center justify-between",
      rowStart: "flex items-start",
      col: "flex flex-col",
      colCenter: "flex flex-col items-center",
      center: "flex items-center justify-center",
      grid: "grid",
      relative: "relative",
    },
    /** Spacing inside */
    padding: {
      none: "",
      xs: "p-1",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
    /** Spacing between children */
    gap: {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    /** Height constraints */
    height: {
      full: "h-full",
    },
    /** Background */
    background: {
      surface: "bg-background",
    },
    /** Flex child behaviour */
    grow: {
      /** Fills remaining space and prevents overflowing its min-content size. */
      true: "flex-1 min-w-0",
    },
    shrink: {
      /** Prevents flex item from shrinking. */
      "0": "shrink-0",
    },
    /** Border utilities */
    border: {
      b: "border-b",
    },
    /** Top padding overrides */
    pt: {
      "6": "pt-6",
    },
    /** Vertical spacing between block children (space-y). Use for stacked block elements, not flex. */
    spaceY: {
      "1": "space-y-1",
      "2": "space-y-2",
      "4": "space-y-4",
    },
  },
});

export type DivProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof divVariants>;

export const Div = forwardRef<HTMLDivElement, DivProps>(function Div(
  {
    layout,
    padding,
    gap,
    height,
    background,
    grow,
    shrink,
    border,
    pt,
    spaceY,
    className,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        divVariants({ layout, padding, gap, height, background, grow, shrink, border, pt, spaceY }),
        className,
      )}
      {...props}
    />
  );
});
