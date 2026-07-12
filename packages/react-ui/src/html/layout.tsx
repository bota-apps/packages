/**
 * html/layout — polymorphic layout primitives with CVA.
 *
 * All layout CVA lives here. layout.tsx re-exports from this file.
 * These components are intentionally polymorphic (via `as` prop) —
 * they render as whatever HTML element makes semantic sense at the call site.
 */
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const gapScale = {
  none: "",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

type BaseLayoutProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/* ------------------------------------------------------------------ */
/* Box — polymorphic layout primitive with optional CVA variants        */
/* ------------------------------------------------------------------ */
export const boxVariants = cva("", {
  variants: {
    position: {
      relative: "relative",
      absolute: "absolute",
    },
    inset: {
      topRight: "top-0 right-0",
      topRightOverlap: "-top-0.5 -right-0.5",
    },
    z: {
      10: "z-10",
    },
    pointerEvents: {
      none: "pointer-events-none",
    },
    border: {
      left: "border-l-2 pl-3",
    },
  },
});

type BoxProps<T extends ElementType> = BaseLayoutProps<T> & VariantProps<typeof boxVariants>;

export function Box<T extends ElementType = "div">({
  as,
  position,
  inset,
  z,
  pointerEvents,
  border,
  className,
  ...props
}: BoxProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(boxVariants({ position, inset, z, pointerEvents, border }), className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Stack — vertical flex column                                         */
/* ------------------------------------------------------------------ */
export const stackVariants = cva("flex flex-col", {
  variants: {
    gap: gapScale,
    align: {
      stretch: "",
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
    grow: {
      true: "flex-1 min-w-0",
      false: "",
    },
    // Fixed-width leading column (e.g. a labeled row's date/label column). Pair
    // with `shrink="0"` so it holds its width inside a flex row.
    width: {
      xs: "w-16",
      sm: "w-24",
      md: "w-32",
      lg: "w-40",
      xl: "w-48",
    },
    shrink: {
      "0": "shrink-0",
    },
  },
  defaultVariants: {
    gap: "none",
    align: "stretch",
  },
});

type StackProps<T extends ElementType> = BaseLayoutProps<T> & VariantProps<typeof stackVariants>;

export function Stack<T extends ElementType = "div">({
  as,
  gap,
  align,
  grow,
  width,
  shrink,
  className,
  ...props
}: StackProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(stackVariants({ gap, align, grow, width, shrink }), className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Inline — horizontal flex row                                         */
/* ------------------------------------------------------------------ */
export const inlineVariants = cva("flex", {
  variants: {
    gap: gapScale,
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    justify: {
      start: "",
      center: "justify-center",
      between: "justify-between",
      end: "justify-end",
    },
    wrap: {
      true: "flex-wrap",
      false: "",
    },
    position: {
      relative: "relative",
      absolute: "absolute",
    },
    inset: {
      topRight: "top-0 right-0",
    },
    // Row chrome — turns Inline into a proper list/selectable row without raw
    // Tailwind. For nested/hierarchical rows, combine `paddingX` with `indent`:
    // both classes render (px-* + pl-*) and the CSS cascade lets the deeper
    // pl-* win the left side, matching the original raw-className behavior.
    // `indent` values are tuned to pair with the same-named `paddingX` (an
    // indented row inside an xl-padded document uses `paddingX="xl" indent="xl"`)
    // — they are not an absolute size scale of their own.
    paddingX: {
      none: "",
      sm: "px-2",
      md: "px-4",
      lg: "px-6",
      xl: "px-8",
    },
    paddingY: {
      none: "",
      sm: "py-1",
      md: "py-2",
      lg: "py-3",
      xl: "py-5",
    },
    borderBottom: {
      true: "border-b",
      false: "",
    },
    borderTop: {
      true: "border-t",
      false: "",
    },
    background: {
      none: "",
      muted: "bg-muted/20",
      primary: "bg-primary/10",
      primarySubtle: "bg-primary/5",
    },
    indent: {
      none: "",
      sm: "pl-6",
      md: "pl-10",
      lg: "pl-14",
      xl: "pl-12",
    },
    // Left accent bar for document/section headers (statement/invoice-style artifacts).
    accent: {
      true: "border-l-[3px] border-l-primary",
      false: "",
    },
  },
  defaultVariants: {
    gap: "none",
    align: "center",
    justify: "start",
  },
});

type InlineProps<T extends ElementType> = BaseLayoutProps<T> & VariantProps<typeof inlineVariants>;

export function Inline<T extends ElementType = "div">({
  as,
  gap,
  align,
  justify,
  wrap,
  position,
  inset,
  paddingX,
  paddingY,
  borderBottom,
  borderTop,
  background,
  indent,
  accent,
  className,
  ...props
}: InlineProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        inlineVariants({
          gap,
          align,
          justify,
          wrap,
          position,
          inset,
          paddingX,
          paddingY,
          borderBottom,
          borderTop,
          background,
          indent,
          accent,
        }),
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Grid — container-responsive CSS grid                                 */
/* ------------------------------------------------------------------ */
export const gridVariants = cva("grid", {
  variants: {
    gap: gapScale,
    columns: {
      1: "",
      2: "grid-cols-1 @xl:grid-cols-2",
      3: "grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3",
      4: "grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4",
    },
  },
  defaultVariants: {
    gap: "none",
    columns: 1,
  },
});

type GridProps<T extends ElementType> = BaseLayoutProps<T> & VariantProps<typeof gridVariants>;

/**
 * Multi-column grids react to their own container width, not the viewport —
 * a grid in a narrow panel collapses to one column even on a wide screen.
 * The `@container` scope goes on a wrapper the component renders itself;
 * the element carrying the `@…:` variants must live inside it.
 */
export function Grid<T extends ElementType = "div">({
  as,
  gap,
  columns,
  className,
  ...props
}: GridProps<T>) {
  const Component = as ?? "div";
  const grid = <Component className={cn(gridVariants({ gap, columns }), className)} {...props} />;
  if (columns == null || columns === 1) {
    return grid;
  }
  return <div className="@container">{grid}</div>;
}

/* ------------------------------------------------------------------ */
/* Center — flex center with optional max-width constraint             */
/* ------------------------------------------------------------------ */
export const centerVariants = cva("flex items-center justify-center", {
  variants: {
    maxWidth: {
      none: "",
      sm: "max-w-3xl mx-auto",
      md: "max-w-4xl mx-auto",
      lg: "max-w-5xl mx-auto",
    },
  },
  defaultVariants: {
    maxWidth: "none",
  },
});

type CenterProps<T extends ElementType> = BaseLayoutProps<T> & VariantProps<typeof centerVariants>;

export function Center<T extends ElementType = "div">({
  as,
  maxWidth,
  className,
  ...props
}: CenterProps<T>) {
  const Component = as ?? "div";
  return <Component className={cn(centerVariants({ maxWidth }), className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/* Container — constrained content area with vertical rhythm           */
/* ------------------------------------------------------------------ */
export const containerVariants = cva("container", {
  variants: {
    padding: {
      none: "",
      sm: "py-4",
      md: "py-6",
      lg: "py-8",
    },
  },
  defaultVariants: {
    padding: "none",
  },
});

type ContainerProps<T extends ElementType> = BaseLayoutProps<T> &
  VariantProps<typeof containerVariants>;

export function Container<T extends ElementType = "div">({
  as,
  padding,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return <Component className={cn(containerVariants({ padding }), className)} {...props} />;
}
