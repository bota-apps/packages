/**
 * html/form — variant-styled <form> primitive.
 * This replaces nativeForm.tsx — forms live here.
 */
import { forwardRef, type FormHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const formElVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    gap: "none",
  },
});

export type FormElProps = FormHTMLAttributes<HTMLFormElement> & VariantProps<typeof formElVariants>;

export const FormEl = forwardRef<HTMLFormElement, FormElProps>(function FormEl(
  { gap, className, ...props },
  ref,
) {
  return <form ref={ref} className={cn(formElVariants({ gap }), className)} {...props} />;
});
