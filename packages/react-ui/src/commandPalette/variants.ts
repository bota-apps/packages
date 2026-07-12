import { cva } from "class-variance-authority";

/** Root command surface (also used standalone, outside the dialog). */
export const commandVariants = cva(
  "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
);

/** Search row wrapper — leading icon + borderless input. */
export const commandInputWrapperVariants = cva("flex items-center border-b px-3", {
  variants: {},
});

export const commandInputVariants = cva(
  "flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
);

export const commandListVariants = cva(
  "max-h-[300px] overflow-y-auto overflow-x-hidden overscroll-contain",
);

export const commandEmptyVariants = cva("py-6 text-center text-sm text-muted-foreground");

export const commandGroupVariants = cva(
  "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
);

export const commandSeparatorVariants = cva("-mx-1 h-px bg-border");

/**
 * Actionable row. cmdk marks the keyboard-highlighted row with
 * data-selected — a transient highlight, so it uses the `muted` surface
 * (persistent on/active states are the only `selected`-token consumers).
 */
export const commandItemVariants = cva(
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
);

/** Right-aligned shortcut hint inside an item. */
export const commandShortcutVariants = cva("ml-auto text-xs tracking-widest text-muted-foreground");
