/**
 * html/main — variant-styled <main> primitive.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const mainVariants = cva("", {
  variants: {
    variant: {
      app: "flex-1",
      page: "flex-1 overflow-y-auto",
      content: "flex flex-1 flex-col overflow-auto",
    },
  },
});

export type MainProps = HTMLAttributes<HTMLElement> & VariantProps<typeof mainVariants>;

export const Main = forwardRef<HTMLElement, MainProps>(function Main(
  { variant, className, ...props },
  ref,
) {
  return <main ref={ref} className={cn(mainVariants({ variant }), className)} {...props} />;
});
