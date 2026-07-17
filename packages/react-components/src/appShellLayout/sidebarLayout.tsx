import { useState } from "react";
import { Button, Sheet, SheetContent, SheetTrigger, VisuallyHidden } from "@bota-apps/react-ui";
import { Menu } from "lucide-react";
import type { AppShellSlots } from "./types";
import { appShellLayoutVariants } from "./variants";

/** Sidebar navigation + top bar + content well anchored to the rail. */
export function SidebarLayout({ brand, nav, headerLeft, headerRight, children }: AppShellSlots) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={appShellLayoutVariants({ layout: "sidebar" })}>
      {/* The rail is chrome: it renders against the sidebar-* tokens so a brand
          can restyle it independently of the content surfaces (e.g. a dark rail
          over a light page). Below md the rail hides and the header's menu
          button opens the same nav in a sheet. */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground px-4 py-6 md:flex">
        <div className="px-2">{brand}</div>
        <nav className="mt-8 flex flex-col gap-1">{nav}</nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-sidebar-border bg-sidebar text-sidebar-foreground px-3 py-3 sm:gap-4 sm:px-6">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                <Menu />
                <VisuallyHidden>Open navigation</VisuallyHidden>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              padding="none"
              title=""
              description=""
              className="w-72 border-sidebar-border bg-sidebar text-sidebar-foreground"
            >
              <div className="px-6 py-6">{brand}</div>
              {/* Navigating closes the sheet — group toggles (buttons) keep it open. */}
              <nav
                className="flex flex-col gap-1 px-4 pb-6"
                onClickCapture={(event) => {
                  if (event.target instanceof HTMLElement && event.target.closest("a")) {
                    setMobileNavOpen(false);
                  }
                }}
              >
                {nav}
              </nav>
            </SheetContent>
          </Sheet>

          {/* min-w-0 + flex-1 gives the contextual text all the spare width and
              lets it truncate instead of wrapping word-per-line. */}
          <div className="min-w-0 flex-1">{headerLeft}</div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">{headerRight}</div>
        </header>

        {/* Anchored to the rail, not centered: a centered column next to a
            fixed rail reads as a giant left gutter on wide screens. The cap
            keeps line lengths sane; spare width stays on the right. */}
        <main className="w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
