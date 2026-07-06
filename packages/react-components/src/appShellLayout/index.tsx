import { SidebarLayout } from "./sidebarLayout";
import { TopnavLayout } from "./topnavLayout";
import type { AppShellSlots } from "./types";

export * from "./variants";

/** The chrome arrangements the shell ships; AppearanceProvider persists one of these. */
export const appShellLayoutKinds = ["sidebar", "topnav"] as const;
export type AppShellLayoutKind = (typeof appShellLayoutKinds)[number];

type AppShellLayoutProps = AppShellSlots & {
  /** Which chrome arrangement to render — every layout consumes the same slots. */
  layout?: AppShellLayoutKind;
};

/**
 * The authenticated app chrome — the slots stay identical across layouts, so
 * flipping `layout` re-arranges the same content. All layout styling lives in
 * the per-layout files against the design tokens; AppShell composes this with
 * slots and stays free of layout className.
 */
export function AppShellLayout({ layout = "sidebar", ...slots }: AppShellLayoutProps) {
  if (layout === "topnav") {
    return <TopnavLayout {...slots} />;
  }
  return <SidebarLayout {...slots} />;
}
