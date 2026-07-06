/**
 * html/span — variant-styled <span> primitives.
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const spanVariants = cva("", {
  variants: {
    display: {
      inline: "",
      inlineFlex: "inline-flex items-center",
      srOnly: "sr-only",
    },
    gap: {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
    },
    weight: {
      semibold: "font-semibold",
      medium: "font-medium",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
    },
    opacity: {
      "90": "opacity-90",
    },
    truncate: {
      true: "truncate",
    },
    lineClamp: {
      "2": "line-clamp-2",
      "3": "line-clamp-3",
    },
    tone: {
      muted: "text-muted-foreground",
    },
  },
});

export type SpanProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof spanVariants>;

export const Span = forwardRef<HTMLSpanElement, SpanProps>(function Span(
  { display, gap, weight, size, opacity, truncate, lineClamp, tone, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        spanVariants({ display, gap, weight, size, opacity, truncate, lineClamp, tone }),
        className,
      )}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* navLabelClass — label style per sidebar nav tree depth              */
/* ------------------------------------------------------------------ */

const navLabelVariants = cva("", {
  variants: {
    depth: {
      "0": "",
      "1": "text-sm font-normal text-muted-foreground/90",
      "2": "text-xs font-normal text-muted-foreground/70",
    },
  },
  defaultVariants: { depth: "0" },
});

/** Returns the className for a sidebar nav label at a given tree depth. Depth >= 2 uses the deep style. */
export function navLabelClass(treeLevel: number): string | undefined {
  if (treeLevel === 0) {
    return undefined;
  }
  const depth = treeLevel >= 2 ? "2" : "1";
  return navLabelVariants({ depth });
}

/* ------------------------------------------------------------------ */
/* ActionLinkEl — inline icon+label link for RouteLink variant="text"  */
/* ------------------------------------------------------------------ */

export const actionLinkVariants = cva(
  "inline-flex items-center transition-colors text-primary group-hover/tl:text-primary/80 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: "gap-1.5 text-sm font-medium [&_svg]:size-4",
        lg: "gap-2 text-base font-semibold [&_svg]:size-5",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type ActionLinkElProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof actionLinkVariants>;

export const ActionLinkEl = forwardRef<HTMLSpanElement, ActionLinkElProps>(function ActionLinkEl(
  { size, className, ...props },
  ref,
) {
  return <span ref={ref} className={cn(actionLinkVariants({ size }), className)} {...props} />;
});
