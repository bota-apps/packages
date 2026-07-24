/**
 * html/button — variant-styled <button> primitive.
 *
 * All button CVA lives here. Components that render a button element
 * import ButtonEl (or buttonVariants for Slot/asChild patterns).
 */
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { focusRingClasses, pressableClasses } from "./interaction";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    focusRingClasses,
    pressableClasses,
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-raised hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-raised hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-raised hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-raised hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** Text-action: no background, no border. Use when the activation is a click handler, not a route link. */
        action: "text-primary hover:text-primary/80",
        "action-destructive": "text-destructive hover:text-destructive/80",
        /** Floating action button — rounded full, primary bg. Combine with size="fab". */
        fab: "rounded-full bg-primary text-white shadow-floating hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        /** Dismiss button inside a colored notification banner — ghost with white text. */
        "ghost-dismiss":
          "flex-shrink-0 text-white opacity-70 hover:opacity-100 hover:bg-transparent hover:text-white",
        /** Card-style button (schema selector, interactive tiles). */
        card: "w-full text-left rounded-lg border bg-card p-4 shadow-raised hover:shadow-floating hover:border-primary/50 cursor-pointer",
        /**
         * Control rendered on the shell chrome (header bar / sidebar rail):
         * styled from the sidebar-* token set so it stays legible on brands
         * whose chrome diverges from the page surface — the page-token
         * variants (outline/secondary) go white-on-white there.
         */
        chrome:
          "border border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-sidebar-ring/60",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        /** Used with variant="fab" — replaces default padding with a square touch target. */
        fab: "p-4",
        /** No padding override — used when the variant (e.g. "card") provides its own spacing. */
        auto: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      /** FAB fixed positioning. Set when using variant="fab". */
      position: {
        "bottom-right": "fixed z-90 bottom-8 right-8",
        "bottom-left": "fixed z-90 bottom-8 left-8",
      },
      /** Responsive visibility: hide on specific breakpoints. */
      responsive: {
        /** Visible only on mobile — hidden on lg and above. */
        mobileOnly: "lg:hidden",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

export type ButtonElProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const ButtonEl = forwardRef<HTMLButtonElement, ButtonElProps>(function ButtonEl(
  { variant, size, fullWidth, position, responsive, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth, position, responsive }), className)}
      {...props}
    />
  );
});
