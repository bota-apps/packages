import type { AppShellSlots } from "./types";
import { appShellLayoutVariants } from "./variants";

/** Sidebar navigation + top bar + centered content well. */
export function SidebarLayout({ brand, nav, headerLeft, headerRight, children }: AppShellSlots) {
  return (
    <div className={appShellLayoutVariants({ layout: "sidebar" })}>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 sm:flex">
        <div className="px-2">{brand}</div>
        <nav className="mt-8 flex flex-col gap-1">{nav}</nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-3">
          <div className="min-w-0">{headerLeft}</div>
          <div className="flex items-center gap-2">{headerRight}</div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
