import type { ReactNode } from "react";
import { useAuth } from "@bota-apps/auth-client";
import { Button, Span, Text } from "@bota-apps/react-ui";
import { LogOut } from "lucide-react";
import { useAppearance } from "../appearanceProvider";
import { AppShellLayout } from "../appShellLayout";
import { NavList, type NavItemDef } from "../navList";
import { PresetSelect } from "../presetSelect";
import { ThemeToggle } from "../themeToggle";

export * from "./variants";

type AppShellProps = {
  /** Brand text shown in the shell chrome (typically appConfig.appTitle). */
  title: string;
  /** Per-app nav entries (each app owns its own src/navItems.ts). */
  navItems: NavItemDef[];
  /**
   * App-provided header controls, placed before the built-in theme/sign-out
   * controls. This is where an app wires its own i18n-coupled controls — most
   * notably a `<LanguageToggle>` bound to the app's translation runtime, which
   * the shell can't own because the supported languages are app data.
   */
  headerActions?: ReactNode;
  children: ReactNode;
};

// The authenticated app chrome. Fully app-agnostic: every per-app value (title,
// nav) arrives via props, and the look comes from the ambient
// AppearanceProvider — one preset pick restyles brand tokens, shell layout, and
// density together, plus the personal light/dark toggle. Apps wanting granular
// axis controls mount LayoutToggle/DensityToggle themselves. The sign-out
// bounce uses the auth client's own loginUrl — no BFF origin prop needed.
export function AppShell({ title, navItems, headerActions, children }: AppShellProps) {
  const { user, logout, loginUrl } = useAuth();
  const { layout } = useAppearance();

  async function handleSignOut() {
    await logout();
    // Back to the gateway login, which bounces here once re-authenticated.
    window.location.href = loginUrl(window.location.origin);
  }

  return (
    <AppShellLayout
      layout={layout}
      brand={
        <Text size="lg" weight="semibold">
          {title}
        </Text>
      }
      // The rail expands groups in place; the bar opens them as overlay menus.
      nav={
        <NavList items={navItems} orientation={layout === "topnav" ? "horizontal" : "vertical"} />
      }
      headerLeft={
        user ? (
          // Inherit the chrome's sidebar-foreground (already a muted tone
          // relative to the chrome surface) — the page-scoped muted token can
          // be unreadable on dark-chrome brands. Truncates in narrow headers
          // instead of wrapping word-per-line.
          <Text as="div" size="sm" className="truncate">{`Signed in as ${user.name}`}</Text>
        ) : undefined
      }
      headerRight={
        <>
          {headerActions}
          <PresetSelect />
          <ThemeToggle />
          <Button variant="secondary" size="sm" onClick={handleSignOut}>
            <LogOut />
            {/* Icon-only on phones (label stays for screen readers) — the
                visible label costs too much header width. */}
            <Span display="srOnlyMobile">Sign out</Span>
          </Button>
        </>
      }
    >
      {children}
    </AppShellLayout>
  );
}
