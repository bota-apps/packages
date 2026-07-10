import type { Meta, StoryObj } from "@storybook/react";
import { AuthProvider, type AuthClient, type AuthState } from "@bota-apps/auth-client";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  BookOpenText,
  Droplet,
  FileText,
  Home,
  IceCreamCone,
  Layers,
  Receipt,
  ScrollText,
  Settings,
  SquareTerminal,
  Users,
} from "lucide-react";
import { AppearanceProvider, type AppearancePreset } from "../appearanceProvider";
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

// Includes a nested group so both shell arrangements exercise their group
// presentation: the sidebar expands it in place, the topnav opens it as an
// overlay menu (with the deeper level as a submenu).
const navItems: NavItemDef[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/people", label: "People", icon: Users },
  {
    to: "/documents",
    label: "Documents",
    icon: FileText,
    children: [
      { to: "/documents/statements", label: "Statements", icon: ScrollText },
      {
        to: "/documents/invoices",
        label: "Invoices",
        icon: Receipt,
        children: [{ to: "/documents/invoices/archive", label: "Archive", icon: FileText }],
      },
    ],
  },
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
// storybook host imports the shipped brands/*.css token blocks. Each shipped
// look combines its own surfaces, chrome, typeface, corner radius, layout, and
// density, so switching presets reads as switching products.
const shippedPresets: readonly AppearancePreset[] = [
  {
    value: "bota",
    label: "Bota",
    icon: Droplet,
    description: "The signature look — cool blue, roomy",
  },
  {
    value: "manuscript",
    label: "Manuscript",
    icon: BookOpenText,
    description: "Warm paper, serif voice, masthead nav",
    brand: "manuscript",
    layout: "topnav",
  },
  {
    value: "terminal",
    label: "Terminal",
    icon: SquareTerminal,
    description: "Monospace, square corners, dense",
    brand: "terminal",
    layout: "topnav",
    density: "compact",
  },
  {
    value: "sorbet",
    label: "Sorbet",
    icon: IceCreamCone,
    description: "Soft rounded corners, berry brights",
    brand: "sorbet",
  },
  {
    value: "graphite",
    label: "Graphite",
    icon: Layers,
    description: "Charcoal chrome, crisp and dense",
    brand: "graphite",
    density: "compact",
  },
];

export const Default: Story = {
  render: () => (
    <AuthProvider client={stubAuthClient}>
      <AppearanceProvider presets={shippedPresets}>
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
