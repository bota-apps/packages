/**
 * html/iframe — variant-styled <iframe> primitive.
 */
import { forwardRef, type IframeHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const iframeVariants = cva("", {
  variants: {
    variant: {
      preview: "w-full h-full border-0 bg-background",
      inline: "w-full border-0",
    },
  },
  defaultVariants: {
    variant: "preview",
  },
});

export type IframeProps = IframeHTMLAttributes<HTMLIFrameElement> &
  VariantProps<typeof iframeVariants>;

export const Iframe = forwardRef<HTMLIFrameElement, IframeProps>(function Iframe(
  { variant, className, title, ...props },
  ref,
) {
  return (
    <iframe
      ref={ref}
      title={title ?? "preview"}
      className={cn(iframeVariants({ variant }), className)}
      {...props}
    />
  );
});
