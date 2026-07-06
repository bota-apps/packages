/**
 * html/tree — CVA-styled tree diagram primitives with visual connector lines.
 *
 * Exports:
 *   TreeRootEl           — Scrollable tree container with role="tree"
 *   TreeBranchEl         — Vertical flex container for node + children
 *   TreeChildrenEl       — Horizontal flex row of child branches
 *   TreeChildWrapperEl   — Wraps each child with connector line pseudo-elements
 *   TreeVerticalLineEl   — Vertical connector from parent to children row
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* TreeRootEl — scrollable tree container                               */
/* ------------------------------------------------------------------ */

export const treeRootVariants = cva("overflow-x-auto flex flex-col items-center", {
  variants: {
    size: {
      sm: "py-2",
      md: "py-4",
      lg: "py-6",
    },
  },
  defaultVariants: { size: "md" },
});

export type TreeRootElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof treeRootVariants>;

export const TreeRootEl = forwardRef<HTMLDivElement, TreeRootElProps>(function TreeRootEl(
  { size, className, ...props },
  ref,
) {
  return (
    <div ref={ref} role="tree" className={cn(treeRootVariants({ size }), className)} {...props} />
  );
});

/* ------------------------------------------------------------------ */
/* TreeBranchEl — flex-col for node + children                          */
/* ------------------------------------------------------------------ */

export const TreeBranchEl = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { align?: "center" | "start" }
>(function TreeBranchEl({ className, align = "center", ...props }, ref) {
  return (
    <div
      ref={ref}
      role="treeitem"
      className={cn("flex flex-col", align === "start" ? "items-start" : "items-center", className)}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* TreeChildrenEl — horizontal row of child branches                    */
/* ------------------------------------------------------------------ */

export const TreeChildrenEl = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { align?: "center" | "start" }
>(function TreeChildrenEl({ className, align = "center", ...props }, ref) {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        "flex items-start",
        align === "start" ? "justify-start" : "justify-center",
        className,
      )}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* TreeChildWrapperEl — child wrapper with connector pseudo-elements     */
/* ------------------------------------------------------------------ */

export const treeChildWrapperVariants = cva("relative flex flex-col items-center", {
  variants: {
    /** Which segment of the horizontal bar to render. */
    position: {
      first: "before:left-1/2 before:right-0",
      middle: "before:left-0 before:right-0",
      last: "before:left-0 before:right-1/2",
      only: "before:hidden",
    },
    /** Controls connector height and horizontal spacing. */
    size: {
      sm: "px-2",
      md: "px-3",
      lg: "px-4",
    },
    /** When true, renders ::before (horizontal bar) and ::after (vertical stub). */
    connectors: {
      true: [
        "before:content-[''] before:absolute before:top-0 before:h-px before:bg-border",
        "after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-px after:bg-border",
      ].join(" "),
      false: "pt-2",
    },
  },
  compoundVariants: [
    { connectors: true, size: "sm", class: "pt-4 after:h-4" },
    { connectors: true, size: "md", class: "pt-6 after:h-6" },
    { connectors: true, size: "lg", class: "pt-8 after:h-8" },
  ],
  defaultVariants: { connectors: true, position: "middle", size: "md" },
});

export type TreeChildWrapperElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof treeChildWrapperVariants>;

export const TreeChildWrapperEl = forwardRef<HTMLDivElement, TreeChildWrapperElProps>(
  function TreeChildWrapperEl({ position, size, connectors, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(treeChildWrapperVariants({ position, size, connectors }), className)}
        {...props}
      />
    );
  },
);

/* ------------------------------------------------------------------ */
/* TreeVerticalLineEl — vertical connector from parent to children       */
/* ------------------------------------------------------------------ */

export const treeVerticalLineVariants = cva("w-px bg-border", {
  variants: {
    size: {
      sm: "h-4",
      md: "h-6",
      lg: "h-8",
    },
  },
  defaultVariants: { size: "md" },
});

export type TreeVerticalLineElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof treeVerticalLineVariants>;

export const TreeVerticalLineEl = forwardRef<HTMLDivElement, TreeVerticalLineElProps>(
  function TreeVerticalLineEl({ size, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn(treeVerticalLineVariants({ size }), className)} {...props} />
    );
  },
);
