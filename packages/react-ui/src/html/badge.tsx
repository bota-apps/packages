/**
 * html/badge — variant-styled badge primitives, all rendered as <span>.
 *
 * Three exports:
 *   BadgeEl      — inline text pill (status labels, tags)
 *   IconBadgeEl  — circular icon container with tone variants
 *   StepBubbleEl — circular step indicator with state variants
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* BadgeEl — inline text pill                                           */
/* ------------------------------------------------------------------ */

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-raised hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-raised hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-status-success-subtle text-status-success-subtle-foreground",
        warning:
          "border-transparent bg-status-warning-subtle text-status-warning-subtle-foreground",
        muted: "border-transparent bg-status-neutral-subtle text-status-neutral-subtle-foreground",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[11px] min-w-[5rem] justify-center",
        count: "h-5 min-w-5 px-1 text-[10px] rounded-full justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>;

export type BadgeElProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const BadgeEl = forwardRef<HTMLSpanElement, BadgeElProps>(function BadgeEl(
  { variant, size, className, ...props },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* IconBadgeEl — circular icon container                                */
/* ------------------------------------------------------------------ */

/**
 * The single icon-tile primitive of the kit. Every icon that sits on a card
 * surface renders inside this tile so glyph weight and tint stay identical
 * from one card to the next. The size ramp keeps a 2:1 tile-to-glyph ratio.
 *
 * Shape grammar: `square` for object/feature/navigation icons (the default),
 * `circle` for people, status, and progress indicators.
 */
export const iconBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:shrink-0",
  {
    variants: {
      size: {
        /** Dense rows and compact stat cards. */
        sm: "h-8 w-8 [&_svg]:size-4",
        /** Leading tiles on content, navigation, and feature cards. */
        md: "h-10 w-10 [&_svg]:size-5",
        /** Hero stat cards and empty states. */
        lg: "h-12 w-12 [&_svg]:size-6",
        /** Marketing spotlight surfaces. */
        xl: "h-16 w-16 [&_svg]:size-8",
      },
      shape: {
        square: "rounded-lg",
        circle: "rounded-full",
      },
      tone: {
        primary: "bg-primary/10 text-primary",
        info: "bg-status-info/10 text-status-info",
        success: "bg-status-success/10 text-status-success",
        warning: "bg-status-warning/10 text-status-warning",
        destructive: "bg-destructive/10 text-destructive",
        muted: "bg-muted text-muted-foreground",
      },
    },
    compoundVariants: [
      // The largest tile carries a proportionally larger radius.
      { size: "xl", shape: "square", className: "rounded-xl" },
    ],
    defaultVariants: {
      size: "md",
      shape: "square",
      tone: "primary",
    },
  },
);

export type IconBadgeSize = NonNullable<VariantProps<typeof iconBadgeVariants>["size"]>;
export type IconBadgeShape = NonNullable<VariantProps<typeof iconBadgeVariants>["shape"]>;
export type IconBadgeTone = NonNullable<VariantProps<typeof iconBadgeVariants>["tone"]>;

export type IconBadgeElProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof iconBadgeVariants>;

export const IconBadgeEl = forwardRef<HTMLSpanElement, IconBadgeElProps>(function IconBadgeEl(
  { size, shape, tone, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(iconBadgeVariants({ size, shape, tone }), className)}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* StepBubbleEl — onboarding / progress step indicator                 */
/* ------------------------------------------------------------------ */

export const stepBubbleVariants = cva(
  "inline-flex items-center justify-center rounded-full text-xs font-semibold transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: "h-7 w-7",
        lg: "h-9 w-9",
        xl: "h-11 w-11 text-sm",
        /** Marketing step indicators — matches the lg icon-tile footprint. */
        hero: "h-12 w-12 text-base",
      },
      state: {
        active: "bg-primary text-primary-foreground",
        done: "bg-primary/20 text-primary",
        upcoming: "bg-muted text-muted-foreground",
        warning: "bg-status-warning-subtle text-status-warning-subtle-foreground",
        success: "bg-status-success-subtle text-status-success-subtle-foreground",
        info: "bg-status-info-subtle text-status-info-subtle-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      state: "upcoming",
    },
  },
);

export type StepBubbleState = NonNullable<VariantProps<typeof stepBubbleVariants>["state"]>;

export type StepBubbleElProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof stepBubbleVariants>;

export const StepBubbleEl = forwardRef<HTMLSpanElement, StepBubbleElProps>(function StepBubbleEl(
  { size, state, className, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(stepBubbleVariants({ size, state }), className)} {...props} />
  );
});
