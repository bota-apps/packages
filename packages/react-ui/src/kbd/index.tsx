import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { kbdVariants, type KbdVariantProps } from "./variants";

export * from "./variants";

export type KbdProps = KbdVariantProps & {
  /** The key label, e.g. "⌘", "K", "Enter". */
  children: ReactNode;
};

/** Keyboard-key chip for rendering shortcut hints. */
export function Kbd({ size, children }: KbdProps) {
  return <kbd className={cn(kbdVariants({ size }))}>{children}</kbd>;
}
