import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { navItemVariants } from "./variants";

export * from "./variants";

// The one place sidebar nav links are styled: active/inactive tone is a cva
// variant and the iteration lives here, so feature code composes
// `<NavList items={…} />` with no className. `to` borrows the router's own link
// type, so only real routes are accepted (no casts). Items may nest via
// `children`, which render as a collapsible, indented sub-group (see NavGroup).
export type NavItemDef = {
  to: ComponentProps<typeof Link>["to"];
  label: string;
  icon: LucideIcon;
  /** Nested sub-nav entries. Rendered as a collapsible, indented group. */
  children?: NavItemDef[];
};

export function NavList({ items }: { items: NavItemDef[] }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // Exactly one entry is highlighted — the one the current route belongs to.
  // We drive the active style from this (not per-<Link> activeProps), so an
  // ancestor route like /projects doesn't also light up on /projects/inactive.
  const activeItem = useMemo(() => findActiveItem(items, pathname), [items, pathname]);
  return (
    <>
      {items.map((item, index) => (
        <NavEntry key={`${String(item.to)}::${index}`} item={item} activeItem={activeItem} />
      ))}
    </>
  );
}

// The single active entry: an exact route match wins (checking children first,
// so the deepest exact entry beats an ancestor that shares its route), otherwise
// the entry with the longest matching route prefix (so a detail page highlights
// its list's entry). Mirrors getActiveNavId, but resolves to the node itself.
function findExactItem(items: NavItemDef[], pathname: string): NavItemDef | undefined {
  for (const item of items) {
    if (item.children) {
      const childMatch = findExactItem(item.children, pathname);
      if (childMatch) {
        return childMatch;
      }
    }
    if (pathname === String(item.to)) {
      return item;
    }
  }
  return undefined;
}

function findPrefixItem(items: NavItemDef[], pathname: string): NavItemDef | undefined {
  let best: NavItemDef | undefined;
  let bestLength = -1;
  const search = (nodes: NavItemDef[]) => {
    for (const node of nodes) {
      const target = String(node.to);
      if (pathname.startsWith(`${target}/`) && target.length > bestLength) {
        best = node;
        bestLength = target.length;
      }
      if (node.children) {
        search(node.children);
      }
    }
  };
  search(items);
  return best;
}

function findActiveItem(items: NavItemDef[], pathname: string): NavItemDef | undefined {
  return findExactItem(items, pathname) ?? findPrefixItem(items, pathname);
}

/** Whether the active entry lives under this item (used to auto-open groups). */
function containsItem(item: NavItemDef, activeItem: NavItemDef | undefined): boolean {
  return (item.children ?? []).some(
    (child) => child === activeItem || containsItem(child, activeItem),
  );
}

function NavLink({ item, active }: { item: NavItemDef; active: boolean }) {
  return (
    <Link to={item.to} className={navItemVariants({ active })}>
      <item.icon />
      {item.label}
    </Link>
  );
}

function NavEntry({ item, activeItem }: { item: NavItemDef; activeItem: NavItemDef | undefined }) {
  if (!item.children || item.children.length === 0) {
    return <NavLink item={item} active={item === activeItem} />;
  }
  return <NavGroup item={item} activeItem={activeItem} />;
}

// A parent that also navigates: the label is a real link, the chevron toggles
// the sub-group. It opens automatically when the active entry lives inside it.
function NavGroup({ item, activeItem }: { item: NavItemDef; activeItem: NavItemDef | undefined }) {
  const children = item.children ?? [];
  const relevant = item === activeItem || containsItem(item, activeItem);
  const [open, setOpen] = useState(relevant);

  useEffect(() => {
    if (relevant) {
      setOpen(true);
    }
  }, [relevant]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <div className="min-w-0 flex-1">
          <NavLink item={item} active={item === activeItem} />
        </div>
        <button
          type="button"
          aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
        >
          <ChevronRight className={`size-4 transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="ml-3 flex flex-col gap-1 border-l border-border pl-2">
          {children.map((child, index) => (
            <NavEntry key={`${String(child.to)}::${index}`} item={child} activeItem={activeItem} />
          ))}
        </div>
      )}
    </div>
  );
}
