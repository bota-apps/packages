import type { AppShellSlots } from "./types";
import { appShellLayoutVariants } from "./variants";

/** Single top bar (brand + horizontal nav + header slots) over a full-width content well. */
export function TopnavLayout({ brand, nav, headerLeft, headerRight, children }: AppShellSlots) {
  return (
    <div className={appShellLayoutVariants({ layout: "topnav" })}>
      {/* The bar is chrome (the topnav counterpart of the sidebar rail): it
          renders against the sidebar-* tokens so brands restyle both chrome
          arrangements with one token set. */}
      <header className="flex items-center gap-6 border-b border-sidebar-border bg-sidebar text-sidebar-foreground px-6 py-3">
        <div className="shrink-0">{brand}</div>
        {/* No scroll/clip here: the horizontal NavList measures itself and
            folds entries that don't fit into its trailing overflow menu. */}
        <nav className="flex min-w-0 flex-1 items-center gap-1">{nav}</nav>
        <div className="min-w-0 shrink-0">{headerLeft}</div>
        <div className="flex shrink-0 items-center gap-2">{headerRight}</div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
