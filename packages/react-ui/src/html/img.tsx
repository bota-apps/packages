/**
 * html/img — variant-styled <img> primitive.
 */
import { forwardRef, type ImgHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const imgVariants = cva("", {
  variants: {
    variant: {
      logo: "h-8 w-8 object-contain",
      avatar: "rounded-full object-cover",
      cover: "w-full h-full object-cover",
      auto: "h-auto w-auto",
    },
  },
  defaultVariants: {
    variant: "auto",
  },
});

export type ImgProps = ImgHTMLAttributes<HTMLImageElement> & VariantProps<typeof imgVariants>;

export const Img = forwardRef<HTMLImageElement, ImgProps>(function Img(
  { variant, className, ...props },
  ref,
) {
  return <img ref={ref} className={cn(imgVariants({ variant }), className)} {...props} />;
});
