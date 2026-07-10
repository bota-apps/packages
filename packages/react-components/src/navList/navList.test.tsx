import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileText, Home, Users, UserCheck } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NavList, navItemVariants, type NavItemDef, type NavListOrientation } from "./index";

const items: NavItemDef[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/people", label: "People", icon: Users },
];

// NavList renders TanStack Router <Link>s, which require a router context —
// host it in a minimal in-memory router.
function renderNavList(
  navItems: NavItemDef[] = items,
  initialPath = "/",
  orientation: NavListOrientation = "vertical",
) {
  const rootRoute = createRootRoute({
    component: () => <NavList items={navItems} orientation={orientation} />,
  });
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

    // The active tone (bg-sidebar-primary/10) is what visibly highlights an
    // entry. Only the leaf whose route matches carries it — its parent group and
    // sibling do not — so exactly one item is highlighted. (TanStack's own bare
    // "active" class may be appended by prefix match, but has no styling here.)
    const activeTone = "bg-sidebar-primary/10";
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

// Horizontal orientation: groups must present as overlay menus — an open
// group renders in a portal and never as in-flow children of the bar.
describe("NavList (horizontal)", () => {
  const deepItems: NavItemDef[] = [
    { to: "/", label: "Home", icon: Home },
    {
      to: "/documents",
      label: "Documents",
      icon: FileText,
      children: [
        { to: "/documents/statements", label: "Statements", icon: FileText },
        {
          to: "/documents/invoices",
          label: "Invoices",
          icon: FileText,
          children: [{ to: "/documents/invoices/archive", label: "Archive", icon: FileText }],
        },
      ],
    },
  ];

  it("renders leaves as links and groups as closed menu triggers", async () => {
    renderNavList(deepItems, "/", "horizontal");

    expect((await screen.findByRole("link", { name: "Home" })).getAttribute("href")).toBe("/");
    // The group is a menu button, not a link, and its children start hidden.
    expect(screen.getByRole("button", { name: "Documents" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Documents" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Statements" })).toBeNull();
  });

  it("opens the group as a menu holding the group's own route plus its children", async () => {
    const user = userEvent.setup();
    renderNavList(deepItems, "/", "horizontal");

    await user.click(await screen.findByRole("button", { name: "Documents" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());

    // The group's own route is the panel's first row.
    const own = screen.getByRole("menuitem", { name: "Documents" });
    expect(own.getAttribute("href")).toBe("/documents");
    expect(screen.getByRole("menuitem", { name: "Statements" }).getAttribute("href")).toBe(
      "/documents/statements",
    );
    // A nested group renders as a submenu trigger row, not an in-flow list.
    expect(screen.getByRole("menuitem", { name: "Invoices" }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("keeps the open menu out of the bar's flow (portaled)", async () => {
    const user = userEvent.setup();
    const { container } = renderNavList(deepItems, "/", "horizontal");

    await user.click(await screen.findByRole("button", { name: "Documents" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());

    // The panel mounts in a portal outside the rendered tree — the bar's own
    // DOM must not contain the child entries (that in-flow rendering is what
    // stretched the topnav bar).
    expect(container.textContent).not.toContain("Statements");
  });

  it("marks the trigger active when the active route lives inside the group", async () => {
    renderNavList(deepItems, "/documents/statements", "horizontal");

    const trigger = await screen.findByRole("button", { name: "Documents" });
    expect(trigger.className).toContain("bg-sidebar-primary/10");
    expect((await screen.findByRole("link", { name: "Home" })).className).not.toContain(
      "bg-sidebar-primary/10",
    );
  });
});

// The horizontal list measures its entries with an IntersectionObserver rooted
// at its clipping container. jsdom has no layout, so these tests install a
// driveable observer stub and push intersection entries by hand.
const mockObservers: MockIntersectionObserver[] = [];

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  readonly observed: Element[] = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    mockObservers.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Report the given elements' visibility ratios to the component. */
  report(ratios: ReadonlyMap<Element, number>): void {
    const rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: (): Record<string, never> => ({}),
    };
    const entries = [...ratios].map(([target, intersectionRatio]) => ({
      target,
      intersectionRatio,
      isIntersecting: intersectionRatio > 0,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: 0,
    }));
    this.callback(entries, this);
  }
}

describe("NavList (horizontal overflow)", () => {
  const barItems: NavItemDef[] = [
    { to: "/", label: "Home", icon: Home },
    {
      to: "/documents",
      label: "Documents",
      icon: FileText,
      children: [{ to: "/documents/statements", label: "Statements", icon: FileText }],
    },
    { to: "/settings", label: "Settings", icon: Users },
  ];

  afterEach(() => {
    vi.unstubAllGlobals();
    mockObservers.length = 0;
  });

  function renderBar(initialPath = "/") {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    return renderNavList(barItems, initialPath, "horizontal");
  }

  it("shows no overflow menu while every entry fits", async () => {
    renderBar();

    await screen.findByRole("link", { name: "Home" });
    // One observer per horizontal list, watching one element per entry.
    expect(mockObservers).toHaveLength(1);
    expect(mockObservers[0].observed).toHaveLength(barItems.length);
    expect(screen.queryByRole("button", { name: "More" })).toBeNull();
  });

  it("folds entries that stop fitting into the overflow menu and restores them", async () => {
    const user = userEvent.setup();
    renderBar();

    await screen.findByRole("link", { name: "Home" });
    const observer = mockObservers[0];
    const settingsBox = observer.observed[2];

    act(() => observer.report(new Map([[settingsBox, 0.4]])));

    // The clipped entry keeps its box (stable measurements) but turns
    // invisible, and the overflow menu appears in its stead.
    expect(settingsBox.className).toContain("invisible");
    await user.click(screen.getByRole("button", { name: "More" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    expect(screen.getByRole("menuitem", { name: "Settings" }).getAttribute("href")).toBe(
      "/settings",
    );

    // Once it fits again the menu disappears with it.
    act(() => observer.report(new Map([[settingsBox, 1]])));
    await waitFor(() => expect(screen.queryByRole("button", { name: "More" })).toBeNull());
    expect(settingsBox.className).not.toContain("invisible");
  });

  it("keeps hidden groups reachable as submenus of the overflow menu", async () => {
    const user = userEvent.setup();
    renderBar();

    await screen.findByRole("link", { name: "Home" });
    const observer = mockObservers[0];
    act(() => observer.report(new Map([[observer.observed[1], 0]])));

    await user.click(screen.getByRole("button", { name: "More" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    // The hidden group is a submenu trigger, keeping its children reachable.
    expect(screen.getByRole("menuitem", { name: "Documents" }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("moves the active tone onto the overflow trigger when the active entry hides", async () => {
    renderBar("/settings");

    await screen.findByRole("link", { name: "Home" });
    const observer = mockObservers[0];
    act(() => observer.report(new Map([[observer.observed[2], 0]])));

    const more = await screen.findByRole("button", { name: "More" });
    expect(more.className).toContain("bg-sidebar-primary/10");
  });
});
