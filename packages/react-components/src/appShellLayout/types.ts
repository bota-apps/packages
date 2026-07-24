import type { ReactNode } from "react";

/** The slot contract every shell layout consumes — identical across layouts, so switching is a pure prop change. */
export type AppShellSlots = {
  /** App name / logo. */
  brand: ReactNode;
  /** Navigation entries — typically a <NavList>; the layout owns direction and spacing. */
  nav: ReactNode;
  /** Contextual header content (e.g. the signed-in user). */
  headerLeft?: ReactNode;
  /** Header controls (theme/brand/layout toggles, sign out). */
  headerRight?: ReactNode;
  /**
   * Companion panel docked at the right edge of the content row (e.g. a
   * SidePanel). Sits beside the content well, below the header — it pushes
   * content instead of covering it, and the app stays navigable around it.
   */
  panel?: ReactNode;
  /**
   * Bottom-anchored rail content (typically the signed-in identity card).
   * Sidebar layout renders it at the foot of the rail and of the mobile nav
   * sheet; the topnav layout has no rail and ignores it, so anything vital
   * must also be reachable from the header in that layout.
   */
  sidebarFooter?: ReactNode;
  /**
   * App-wide footer (legal links, copyright) rendered below the content row —
   * spans the content column, not the rail, and scrolls with the page.
   */
  footer?: ReactNode;
  children: ReactNode;
};
