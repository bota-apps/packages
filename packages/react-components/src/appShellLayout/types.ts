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
  children: ReactNode;
};
