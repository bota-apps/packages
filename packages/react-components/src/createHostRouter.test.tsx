import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { createHostRouter } from "./createHostRouter";

function buildRouter(initialPath: string) {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <p>home page</p>,
  });
  const boomRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/boom",
    component: () => {
      throw new Error("exploded in render");
    },
  });
  return createHostRouter(
    rootRoute.addChildren([indexRoute, boomRoute]),
    createMemoryHistory({ initialEntries: [initialPath] }),
  );
}

describe("createHostRouter", () => {
  it("renders the matched route and applies the shared option defaults", async () => {
    const router = buildRouter("/");
    render(<RouterProvider router={router} />);
    expect(await screen.findByText("home page")).toBeTruthy();
    expect(router.options.defaultPreload).toBe("intent");
  });

  it("renders the shared NotFound surface for an unknown path", async () => {
    const router = buildRouter("/nowhere");
    render(<RouterProvider router={router} />);
    expect(await screen.findByText("404 — Not Found")).toBeTruthy();
  });

  it("renders the shared RouteError surface when a route throws", async () => {
    const router = buildRouter("/boom");
    render(<RouterProvider router={router} />);
    expect(await screen.findByText("Something went wrong")).toBeTruthy();
    expect(await screen.findByText("exploded in render")).toBeTruthy();
  });
});
