import { cva } from "class-variance-authority";

/**
 * Row container for {@link ListItem}. Distinct from `list`'s `listItemVariants`
 * (which styles rows *inside* the List renderer) — this is the standalone row a
 * caller composes directly. `clickable` adds the interactive hover affordance.
 */
export const listItemRowVariants = cva("", {
  variants: {
    clickable: {
      true: "cursor-pointer rounded-md hover:bg-muted/50 transition-colors",
    },
  },
});
