import { cleanup, render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { fireEvent } from "@testing-library/react";
import { Home, Users, UserCheck } from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";
import { NavList, navItemVariants, type NavItemDef } from "./index";

const items: NavItemDef[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/people", label: "People", icon: Users },
];

// NavList renders TanStack Router <Link>s, which require a router context —
// host it in a minimal in-memory router.
function renderNavList(navItems: NavItemDef[] = items, initialPath = "/") {
  const rootRoute = createRootRoute({ component: () => <NavList items={navItems} /> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
  return render(<RouterProvider router={router} />);
}

const nestedItems: NavItemDef[] = [
  {
    to: "/people",
    label: "People",
    icon: Users,
    children: [
      { to: "/people/active", label: "Active", icon: UserCheck },
      { to: "/people/inactive", label: "Inactive", icon: UserCheck },
    ],
  },
];

afterEach(cleanup);

describe("NavList", () => {
  it("renders a link per item with its label and href", async () => {
    renderNavList();

    const home = await screen.findByRole("link", { name: "Home" });
    expect(home.getAttribute("href")).toBe("/");
    const people = screen.getByRole("link", { name: "People" });
    expect(people.getAttribute("href")).toBe("/people");
  });

  it("styles links with the inactive nav item variant by default", async () => {
    renderNavList();

    const people = await screen.findByRole("link", { name: "People" });
    expect(people.className).toBe(navItemVariants({ active: false }));
  });

  it("renders nested children as a collapsible group, open when a descendant is active", async () => {
    renderNavList(nestedItems, "/people/active");

    // Parent link plus both child links are rendered (group auto-opened because
    // the active route lives inside it).
    expect(await screen.findByRole("link", { name: "People" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Active" }).getAttribute("href")).toBe(
      "/people/active",
    );
    expect(screen.getByRole("link", { name: "Inactive" }).getAttribute("href")).toBe(
      "/people/inactive",
    );
  });

  it("highlights only the active leaf, not its ancestors", async () => {
    renderNavList(nestedItems, "/people/active");

    // The active tone (bg-primary/10) is what visibly highlights an entry. Only
    // the leaf whose route matches carries it — its parent group and sibling do
    // not — so exactly one item is highlighted. (TanStack's own bare "active"
    // class may be appended by prefix match, but has no styling here.)
    const activeTone = "bg-primary/10";
    expect((await screen.findByRole("link", { name: "Active" })).className).toContain(activeTone);
    expect(screen.getByRole("link", { name: "People" }).className).not.toContain(activeTone);
    expect(screen.getByRole("link", { name: "Inactive" }).className).not.toContain(activeTone);
  });

  it("collapses and expands children via the toggle", async () => {
    renderNavList(nestedItems, "/");

    // Off the group's route, it starts collapsed — children hidden.
    await screen.findByRole("link", { name: "People" });
    expect(screen.queryByRole("link", { name: "Active" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Expand People" }));
    expect(screen.getByRole("link", { name: "Active" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Collapse People" }));
    expect(screen.queryByRole("link", { name: "Active" })).toBeNull();
  });
});
