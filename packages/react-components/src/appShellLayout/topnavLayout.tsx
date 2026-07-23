import type { AppShellSlots } from "./types";
import { appShellLayoutVariants } from "./variants";

/** Single top bar (brand + horizontal nav + header slots) over a full-width content well. */
export function TopnavLayout({ brand, nav, headerLeft, headerRight, panel, children }: AppShellSlots) {
  return (
    <div className={appShellLayoutVariants({ layout: "topnav" })}>
      {/* The bar is chrome (the topnav counterpart of the sidebar rail): it
          renders against the sidebar-* tokens so brands restyle both chrome
          arrangements with one token set. */}
      <header className="flex items-center gap-3 border-b border-sidebar-border bg-sidebar text-sidebar-foreground px-3 py-3 sm:gap-6 sm:px-6">
        <div className="shrink-0">{brand}</div>
        {/* The horizontal NavList measures itself and folds entries that don't
            fit into its trailing overflow menu; the clip here only guards
            non-measuring nav content from overlapping the header actions. */}
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-clip">{nav}</nav>
        {/* Contextual text yields first on a crowded bar: hidden below lg,
            truncated (never wrapping) above it. */}
        <div className="hidden min-w-0 max-w-56 lg:block">{headerLeft}</div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">{headerRight}</div>
      </header>

      {/* The optional docked panel shares the content row below the bar — it
          pushes the well narrower instead of overlaying it. */}
      <div className="flex min-w-0 flex-1 items-stretch">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 min-[1800px]:max-w-7xl">
          {children}
        </main>
        {panel}
      </div>
    </div>
  );
}
