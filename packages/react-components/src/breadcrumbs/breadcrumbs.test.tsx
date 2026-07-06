import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { toRoutePath } from "../routeLink";
import { computeDisplayItems } from "./displayItems";
import { BreadcrumbItemsProvider } from "./context";
import { Breadcrumbs } from "./index";
import type { BreadcrumbItem } from "./types";

function renderTrail(items: BreadcrumbItem[]) {
  const rootRoute = createRootRoute({
    // The sentinel marks the async router mount so tests can await it even
    // when Breadcrumbs itself renders nothing.
    component: () => (
      <BreadcrumbItemsProvider items={items}>
        <p>mounted</p>
        <Breadcrumbs />
      </BreadcrumbItemsProvider>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("Breadcrumbs", () => {
  it("renders linked ancestors and the current crumb as text", async () => {
    renderTrail([{ label: "Projects", to: toRoutePath("/projects") }, { label: "Jane Doe" }]);

    const nav = await screen.findByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeTruthy();
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link.getAttribute("href")).toBe("/projects");
    expect(screen.getByText("Jane Doe").closest("a")).toBeNull();
  });

  it("renders nothing for a single-crumb trail", async () => {
    const { container } = renderTrail([{ label: "Dashboard" }]);
    await screen.findByText("mounted");
    expect(container.querySelector("nav")).toBeNull();
  });
});

describe("computeDisplayItems", () => {
  const items: BreadcrumbItem[] = [
    { label: "A", to: toRoutePath("/a") },
    { label: "B", to: toRoutePath("/a/b") },
    { label: "C", to: toRoutePath("/a/b/c") },
    { label: "D" },
  ];

  it("keeps every crumb when not collapsing", () => {
    const display = computeDisplayItems(items, false);
    expect(display).toHaveLength(4);
    expect(display.every((d) => d.kind === "crumb")).toBe(true);
  });

  it("collapses long trails to first / overflow / second-to-last / last", () => {
    const display = computeDisplayItems(items, true);
    expect(display.map((d) => d.kind)).toEqual(["crumb", "overflow", "crumb", "crumb"]);
    const overflow = display[1];
    if (overflow.kind !== "overflow") {
      throw new Error("expected an overflow item");
    }
    expect(overflow.hidden.map((h) => h.label)).toEqual(["B"]);
  });

  it("leaves short trails uncollapsed even when collapsing is requested", () => {
    const display = computeDisplayItems(items.slice(0, 3), true);
    expect(display.every((d) => d.kind === "crumb")).toBe(true);
  });
});
