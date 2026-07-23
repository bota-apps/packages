import { cva, type VariantProps } from "class-variance-authority";

/** ActionCenter root — a vertical list of suggested next actions. */
export const actionCenterVariants = cva("flex flex-col");

/**
 * Icon chip tone — a soft urgency tint. `primary` uses the `selected` emphasis
 * tokens, never `accent`. Tone is a hint, never the only signal (the action's
 * label always says what to do).
 */
export const actionCenterIconVariants = cva(
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-selected text-selected-foreground",
        warning: "bg-status-warning/15 text-status-warning",
        destructive: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

/**
 * An action row. Becomes an interactive surface (hover `muted`, shared focus
 * ring, press feedback) when actionable; otherwise a static, quiet row. The
 * styling source of truth for both react-ui ActionCenter and any router-aware
 * wrapper (react-components RouteActionCenter) — compose this, don't re-roll it.
 */
export const actionCenterItemVariants = cva(
  "group flex w-full min-w-0 items-center gap-3 rounded-lg text-left",
  {
    variants: {
      interactive: {
        true: "cursor-pointer p-2 transition-colors duration-fast ease-standard hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 motion-reduce:transition-none",
        false: "p-2",
      },
    },
    defaultVariants: {
      interactive: false,
    },
  },
);

export type ActionCenterTone = NonNullable<VariantProps<typeof actionCenterIconVariants>["tone"]>;
