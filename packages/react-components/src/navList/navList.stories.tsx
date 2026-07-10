import type { Meta, StoryObj } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { FileText, Home, Receipt, ScrollText, Settings, Users } from "lucide-react";
import { NavList, type NavItemDef } from "./index";

// NavList renders TanStack Router <Link>s, so the story hosts it inside a
// self-contained in-memory router — no app router or real navigation involved.
const items: NavItemDef[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/people", label: "People", icon: Users },
  {
    to: "/documents",
    label: "Documents",
    icon: FileText,
    children: [
      { to: "/documents/statements", label: "Statements", icon: ScrollText },
      { to: "/documents/invoices", label: "Invoices", icon: Receipt },
    ],
  },
  { to: "/settings", label: "Settings", icon: Settings },
];

function buildRouter() {
  const rootRoute = createRootRoute({
    component: () => (
      <nav className="flex w-60 flex-col gap-1 rounded-lg border border-border p-4">
        <NavList items={items} />
      </nav>
    ),
  });
  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
}

// The horizontal orientation presents groups as overlay menus, so the story
// hosts it in a chrome-toned bar like the topnav arrangement does.
function buildTopnavRouter() {
  const rootRoute = createRootRoute({
    component: () => (
      <nav className="flex items-center gap-1 rounded-lg border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground">
        <NavList items={items} orientation="horizontal" />
      </nav>
    ),
  });
  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
}

const meta: Meta<typeof NavList> = {
  title: "App/NavList",
  component: NavList,
};
export default meta;

type Story = StoryObj<typeof NavList>;

export const Default: Story = {
  render: () => <RouterProvider router={buildRouter()} />,
};

export const Horizontal: Story = {
  render: () => <RouterProvider router={buildTopnavRouter()} />,
};
