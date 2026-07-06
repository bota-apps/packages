/**
 * html/section — variant-styled <section> primitive.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const sectionVariants = cva("", {
  variants: {
    variant: {
      marketing: "py-20",
      hero: "relative py-20 md:py-32",
    },
    background: {
      default: "",
      muted: "bg-muted/50",
      primary: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: {
    background: "default",
  },
});

export type SectionElProps = HTMLAttributes<HTMLElement> & VariantProps<typeof sectionVariants>;

export const SectionEl = forwardRef<HTMLElement, SectionElProps>(function SectionEl(
  { variant, background, className, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(sectionVariants({ variant, background }), className)}
      {...props}
    />
  );
});
