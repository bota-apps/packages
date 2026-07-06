import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider, type AuthClient, type AuthState } from "@bota-apps/auth-client";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Home, Users } from "lucide-react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AppearanceProvider, type AppearancePreset } from "../appearanceProvider";
import { AppShell } from "./index";
import type { NavItemDef } from "../navList";

// A stable snapshot object — useSyncExternalStore requires getState to return
// a cached value, not a fresh object per call.
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
];

// AppShell renders router-backed nav links, so the test hosts it in a minimal
// in-memory router alongside the stubbed auth client and the appearance provider.
function renderAppShell(presets?: readonly AppearancePreset[], headerActions?: ReactNode) {
  const rootRoute = createRootRoute({
    component: () => (
      <AppShell title="Bota Console" navItems={navItems} headerActions={headerActions}>
        <p>Page content</p>
      </AppShell>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(
    <AuthProvider client={stubAuthClient}>
      <AppearanceProvider presets={presets}>
        <RouterProvider router={router} />
      </AppearanceProvider>
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  delete document.documentElement.dataset.brand;
  delete document.documentElement.dataset.density;
});

describe("AppShell", () => {
  it("renders the brand, signed-in user, nav items, and children", async () => {
    renderAppShell();

    expect(await screen.findByText("Bota Console")).toBeTruthy();
    expect(screen.getByText("Signed in as Jane Doe")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "People" })).toBeTruthy();
    expect(screen.getByRole("main").textContent).toContain("Page content");
  });

  it("exposes the mode toggle and sign-out controls, hiding the preset picker for single-preset apps", async () => {
    renderAppShell();

    expect(await screen.findByRole("button", { name: "Toggle theme" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Change theme" })).toBeNull();
  });

  it("renders app-provided headerActions alongside the built-in controls", async () => {
    renderAppShell(undefined, <button type="button">My language toggle</button>);

    expect(await screen.findByRole("button", { name: "My language toggle" })).toBeTruthy();
    // Built-in controls still present.
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
  });

  it("re-styles the whole shell — including the layout — from one preset pick", async () => {
    renderAppShell([
      { value: "bota", label: "Bota" },
      { value: "violetTopnav", label: "Violet topnav", brand: "violet", layout: "topnav" },
    ]);

    // The sidebar layout renders its nav inside an <aside> (complementary landmark).
    expect(await screen.findByRole("complementary")).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Change theme" }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: "Violet topnav" }));

    expect(screen.queryByRole("complementary")).toBeNull();
    expect(screen.getByRole("banner").textContent).toContain("Home");
    expect(document.documentElement.dataset.brand).toBe("violet");
  });
});
