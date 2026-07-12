import { cva, type VariantProps } from "class-variance-authority";

/** Centered container for the empty-state message block. */
export const emptyStateVariants = cva("py-10 px-4 text-center");

/**
 * Icon slot above the title. `default` is a muted inline glyph; `tinted`
 * wraps the icon in a soft circular chip using the persistent-emphasis
 * `selected` tokens.
 */
export const emptyStateIconVariants = cva("mb-4", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      tinted:
        "flex size-12 items-center justify-center rounded-full bg-selected text-selected-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

export type EmptyStateIconVariantProps = VariantProps<typeof emptyStateIconVariants>;
export type EmptyStateVariant = NonNullable<EmptyStateIconVariantProps["variant"]>;
