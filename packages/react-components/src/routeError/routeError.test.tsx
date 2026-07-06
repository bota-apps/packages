import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { RouteError } from "./index";

function renderRouteError(error: Error) {
  const rootRoute = createRootRoute({ component: () => <RouteError error={error} /> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("RouteError", () => {
  it("renders the thrown error's message and a home link", async () => {
    renderRouteError(new Error("Loader blew up"));

    expect(await screen.findByText("Something went wrong")).toBeTruthy();
    expect(screen.getByText("Loader blew up")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Go Home/ })).toBeTruthy();
  });

  it("falls back to the default description for empty error messages", async () => {
    renderRouteError(new Error(""));

    expect(
      await screen.findByText("An unexpected error occurred. Please try again or contact support."),
    ).toBeTruthy();
  });
});
