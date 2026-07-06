/**
 * html/loading — variant-styled loading container <div> + loading helper elements.
 *
 * Controls the outer wrapper layout for loading states.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const loadingContainerVariants = cva("flex items-center justify-center", {
  variants: {
    variant: {
      /** Full-page loading screen. */
      fullscreen: "min-h-screen bg-background",
      /** Section-level vertical padding. */
      section: "py-12",
      /** Inline next to other content. */
      inline: "inline-flex gap-2",
    },
  },
  defaultVariants: {
    variant: "section",
  },
});

export type LoadingContainerElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof loadingContainerVariants>;

export const LoadingContainerEl = forwardRef<HTMLDivElement, LoadingContainerElProps>(
  function LoadingContainerEl({ variant, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn(loadingContainerVariants({ variant }), className)} {...props} />
    );
  },
);

/* ------------------------------------------------------------------ */
/* SpinnerEl — spinning loader icon with size variants                 */
/* ------------------------------------------------------------------ */

export const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
    },
  },
  defaultVariants: { size: "default" },
});

type SpinnerElProps = {
  size?: "sm" | "default" | "lg";
};

/** Animated spinner icon. Size controlled by the `size` variant. */
export function SpinnerEl({ size = "default" }: SpinnerElProps) {
  return <Loader2 className={spinnerVariants({ size })} />;
}

/* ------------------------------------------------------------------ */
/* LoadingInnerEl — layout container for spinner + optional text       */
/* ------------------------------------------------------------------ */

const loadingInnerVariants = cva("flex items-center gap-2", {
  variants: {
    orientation: {
      /** Spinner above text (default for fullscreen/section). */
      vertical: "flex-col",
      /** Spinner beside text (for inline). */
      horizontal: "",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

export type LoadingInnerElProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof loadingInnerVariants>;

export const LoadingInnerEl = forwardRef<HTMLDivElement, LoadingInnerElProps>(
  function LoadingInnerEl({ orientation, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn(loadingInnerVariants({ orientation }), className)} {...props} />
    );
  },
);
