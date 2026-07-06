/**
 * html/heading — variant-styled heading primitives (<h1>–<h6>).
 * One component for all heading levels via the `as` prop.
 */
import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const headingVariants = cva("", {
  variants: {
    mb: {
      "2": "mb-2",
    },
    truncate: {
      true: "truncate",
    },
    variant: {
      h1: "text-4xl md:text-5xl font-bold tracking-tight",
      h2: "text-3xl font-bold",
      h3: "text-2xl font-semibold leading-none tracking-tight",
      h4: "text-xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      /** Pre-styled semantic aliases */
      cardTitle: "text-2xl font-semibold leading-none tracking-tight",
      /** Interactive card title — muted by default, accent on card hover. */
      interactiveCardTitle:
        "text-2xl font-semibold leading-none tracking-tight text-card-foreground group-hover:text-primary transition-colors",
      sectionTitle: "text-2xl font-semibold tracking-tight",
      pageTitle: "text-3xl font-bold",
      display: "text-4xl md:text-6xl font-bold tracking-tight",
    },
  },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingLevel;
  };

export const H = forwardRef<HTMLHeadingElement, HProps>(function H(
  { as: Tag = "h2", variant, mb, truncate, className, ...props },
  ref,
) {
  const Component: ElementType = Tag;
  return (
    <Component
      ref={ref}
      className={cn(headingVariants({ variant, mb, truncate }), className)}
      {...props}
    />
  );
});
