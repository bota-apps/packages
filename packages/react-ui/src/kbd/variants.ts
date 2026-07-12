import { cva, type VariantProps } from "class-variance-authority";

/** Raised keyboard-key chip; sizes control type scale and padding. */
export const kbdVariants = cva(
  "inline-flex items-center justify-center font-mono rounded border border-border bg-muted text-muted-foreground shadow-raised",
  {
    variants: {
      size: {
        sm: "px-1 py-px text-[10px]",
        default: "px-1.5 py-0.5 text-xs",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type KbdVariantProps = VariantProps<typeof kbdVariants>;
export type KbdSize = NonNullable<KbdVariantProps["size"]>;
