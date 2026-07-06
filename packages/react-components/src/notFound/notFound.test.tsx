import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { NotFound } from "./index";

// NotFound renders a RouteLink home, so it needs a router host.
function renderNotFound() {
  const rootRoute = createRootRoute({ component: () => <NotFound /> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("NotFound", () => {
  it("renders the 404 copy and a home link", async () => {
    renderNotFound();

    expect(await screen.findByText("404 — Not Found")).toBeTruthy();
    const home = screen.getByRole("link", { name: /Go Home/ });
    expect(home.getAttribute("href")).toBe("/");
    expect(document.title).toBe("Not Found");
  });
});
