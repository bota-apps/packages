import type { AppShellSlots } from "./types";
import { appShellLayoutVariants } from "./variants";

/** Single top bar (brand + horizontal nav + header slots) over a full-width content well. */
export function TopnavLayout({ brand, nav, headerLeft, headerRight, children }: AppShellSlots) {
  return (
    <div className={appShellLayoutVariants({ layout: "topnav" })}>
      <header className="flex items-center gap-6 border-b border-border bg-card px-6 py-3">
        <div className="shrink-0">{brand}</div>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">{nav}</nav>
        <div className="min-w-0 shrink-0">{headerLeft}</div>
        <div className="flex shrink-0 items-center gap-2">{headerRight}</div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
