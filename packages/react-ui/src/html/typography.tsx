/**
 * html/typography — polymorphic typography primitives with CVA.
 *
 * All typography CVA lives here. typography.tsx re-exports from this file.
 * These are intentionally polymorphic (via `as` prop) so they render as
 * the semantically appropriate heading or text element at the call site.
 */
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* Heading — semantic headings with size and tone variants             */
/* ------------------------------------------------------------------ */

export const headingVariants = cva("", {
  variants: {
    size: {
      inherit: "",
      xl: "text-3xl font-bold",
      lg: "text-2xl font-bold",
      md: "text-xl font-semibold",
      sm: "text-lg font-semibold",
      xs: "text-base font-semibold",
    },
    tone: {
      default: "text-foreground",
      primary: "text-primary",
    },
  },
  defaultVariants: {
    size: "inherit",
    tone: "default",
  },
});

type HeadingProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & VariantProps<typeof headingVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Heading<T extends ElementType = "h2">({
  as,
  size = "inherit",
  tone = "default",
  className,
  ...props
}: HeadingProps<T>) {
  const Component = as ?? "h2";
  return <Component className={cn(headingVariants({ size, tone }), className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/* Text — body text with full presentational control                   */
/* ------------------------------------------------------------------ */

export const textVariants = cva("", {
  variants: {
    tone: {
      inherit: "",
      default: "text-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      primary: "text-primary",
      success: "text-chart-2",
    },
    size: {
      inherit: "",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    weight: {
      inherit: "",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      inherit: "",
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
    lineClamp: {
      none: "",
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
    },
    // Monospace font — for code, IDs, and aligned numeric columns.
    mono: {
      true: "font-mono",
      false: "",
    },
    // Tabular (fixed-width) figures — keeps digits aligned across rows/ranges.
    tabular: {
      true: "tabular-nums",
      false: "",
    },
  },
  defaultVariants: {
    tone: "inherit",
    size: "inherit",
    weight: "inherit",
    align: "inherit",
    truncate: false,
    lineClamp: "none",
    mono: false,
    tabular: false,
  },
});

type TextProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & VariantProps<typeof textVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Text<T extends ElementType = "p">({
  as,
  tone = "inherit",
  size = "inherit",
  weight = "inherit",
  align = "inherit",
  truncate = false,
  lineClamp = "none",
  mono = false,
  tabular = false,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";
  return (
    <Component
      className={cn(
        textVariants({ tone, size, weight, align, truncate, lineClamp, mono, tabular }),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
