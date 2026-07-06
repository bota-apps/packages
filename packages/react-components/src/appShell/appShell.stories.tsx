import type { Meta, StoryObj } from "@storybook/react";
import { AuthProvider, type AuthClient, type AuthState } from "@bota-apps/auth-client";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Home, Settings, Users } from "lucide-react";
import { AppearanceProvider } from "../appearanceProvider";
import { AppShell } from "./index";
import type { NavItemDef } from "../navList";

// AppShell reads the session from the auth client and renders router-backed
// nav links, so the story stubs the auth client and hosts everything in a
// self-contained in-memory router — no BFF and no app router involved.
const authState: AuthState = {
  status: "authenticated",
  user: { id: "u1", name: "Jane Doe", email: "jane@example.com" },
};

const stubAuthClient: AuthClient = {
  getState: () => authState,
  subscribe: () => () => {},
  ensureReady: () => Promise.resolve(),
  refresh: () => Promise.resolve(),
  switchOrganization: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  isAuthenticated: () => true,
  requireSession: () => Promise.resolve(),
  loginUrl: (returnUrl?: string) =>
    `https://auth.example.com/bff/login?returnUrl=${encodeURIComponent(returnUrl ?? "/")}`,
};

const navItems: NavItemDef[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/people", label: "People", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

function buildRouter() {
  const rootRoute = createRootRoute({
    component: () => (
      <AppShell title="Bota Console" navItems={navItems}>
        <div className="rounded-lg border border-dashed border-border p-8 text-muted-foreground">
          Page content renders in the centered content well.
        </div>
      </AppShell>
    ),
  });
  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
}

const meta: Meta<typeof AppShell> = {
  title: "App/AppShell",
  component: AppShell,
};
export default meta;

type Story = StoryObj<typeof AppShell>;

// Multi-preset appearance setup: one pick in the header's PresetSelect applies
// a pre-assembled look — brand tokens, shell layout, and density together. The
// storybook host imports the shipped brands/*.css token blocks.
export const Default: Story = {
  render: () => (
    <AuthProvider client={stubAuthClient}>
      <AppearanceProvider
        presets={[
          { value: "bota", label: "Bota" },
          {
            value: "emeraldCompact",
            label: "Emerald compact",
            brand: "emerald",
            density: "compact",
          },
          { value: "violetTopnav", label: "Violet topnav", brand: "violet", layout: "topnav" },
        ]}
      >
        <RouterProvider router={buildRouter()} />
      </AppearanceProvider>
    </AuthProvider>
  ),
};

export const TopnavLayout: Story = {
  render: () => (
    <AuthProvider client={stubAuthClient}>
      <AppearanceProvider defaultLayout="topnav" storageKey="appearance-topnav-story">
        <RouterProvider router={buildRouter()} />
      </AppearanceProvider>
    </AuthProvider>
  ),
};
