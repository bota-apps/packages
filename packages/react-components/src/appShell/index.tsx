import type { ReactNode } from "react";
import { useAuth } from "@bota-apps/auth-client";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Span,
  Stack,
  Text,
} from "@bota-apps/react-ui";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useAppearance } from "../appearanceProvider";
import { AppShellLayout } from "../appShellLayout";
import { NavList, type NavItemDef } from "../navList";
import { PresetSelect } from "../presetSelect";
import { ThemeToggle } from "../themeToggle";

export * from "./variants";

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

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
   * Controls render on the shell chrome — use `variant="chrome"` buttons so
   * they stay legible on brands whose chrome diverges from the page surface.
   */
  headerActions?: ReactNode;
  /**
   * Secondary line under the signed-in name in the identity card (e.g. the
   * user's role or organization) — app data the shell can't derive.
   */
  userDescription?: string;
  /**
   * Companion panel docked at the right edge of the content row (typically a
   * SidePanel or a SidePanelDock) — non-modal, so the app stays navigable
   * while it is open.
   */
  panel?: ReactNode;
  /**
   * Built-in header appearance controls. "builtin" (default) renders
   * PresetSelect + ThemeToggle; "none" omits them for apps that mount their
   * own appearance UI (e.g. an AppearancePanel behind a headerActions
   * trigger).
   */
  appearanceControls?: "builtin" | "none";
  /** App-wide footer (typically an <AppFooter>) rendered below the content row. */
  footer?: ReactNode;
  children: ReactNode;
};

// The authenticated app chrome. Fully app-agnostic: every per-app value (title,
// nav) arrives via props, and the look comes from the ambient
// AppearanceProvider — one preset pick restyles brand tokens, shell layout, and
// density together, plus the personal light/dark toggle. Apps wanting granular
// axis controls mount LayoutToggle/DensityToggle themselves. The sign-out
// bounce uses the auth client's own loginUrl — no BFF origin prop needed.
export function AppShell({
  title,
  navItems,
  headerActions,
  userDescription,
  panel,
  appearanceControls = "builtin",
  footer,
  children,
}: AppShellProps) {
  const { user, logout, loginUrl } = useAuth();
  const { layout } = useAppearance();

  async function handleSignOut() {
    await logout();
    // Back to the gateway login, which bounces here once re-authenticated.
    window.location.href = loginUrl(window.location.origin);
  }

  // The identity card anchors the rail foot (and the mobile nav sheet), so the
  // sidebar layout keeps the header for actions and moves sign-out into the
  // card's menu. The topnav layout has no rail — there the sign-out button
  // stays in the header instead.
  const identityCard = user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="chrome"
          size="auto"
          fullWidth
          className="justify-start gap-3 border-transparent px-2 py-2 text-left"
        >
          <Avatar size="sm">
            <AvatarFallback size="sm" className="bg-sidebar-accent text-sidebar-accent-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-1 flex-col">
            <Text as="span" size="sm" weight="semibold" truncate>
              {user.name}
            </Text>
            {userDescription && <span className="truncate text-xs">{userDescription}</span>}
          </span>
          <ChevronsUpDown className="shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-56">
        <DropdownMenuLabel>
          <Stack gap="xs">
            <Text as="span" size="sm" weight="semibold">
              {user.name}
            </Text>
            <Text as="span" size="sm" tone="muted">
              {user.email}
            </Text>
          </Stack>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void handleSignOut()}>
          <LogOut />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : undefined;

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
          {appearanceControls === "builtin" && (
            <>
              <PresetSelect variant="chrome" />
              <ThemeToggle variant="chrome" />
            </>
          )}
          {layout === "topnav" && (
            <Button variant="chrome" size="sm" onClick={handleSignOut}>
              <LogOut />
              {/* Icon-only on phones (label stays for screen readers) — the
                  visible label costs too much header width. */}
              <Span display="srOnlyMobile">Sign out</Span>
            </Button>
          )}
        </>
      }
      panel={panel}
      sidebarFooter={identityCard}
      footer={footer}
    >
      {children}
    </AppShellLayout>
  );
}
