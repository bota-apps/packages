import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Home } from "lucide-react";
import { describe, expect, it } from "vitest";
import { RouteLink, toRoutePath } from "./index";

// RouteLink renders a router <Link>, so every test hosts it in a minimal
// in-memory router.
function renderInRouter(ui: React.ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("RouteLink", () => {
  it("renders the text variant as a link with its label", async () => {
    renderInRouter(<RouteLink variant="text" to={toRoutePath("/people")} label="People" />);

    const link = await screen.findByRole("link", { name: "People" });
    expect(link.getAttribute("href")).toBe("/people");
  });

  it("renders the quick-link variant with label and description", async () => {
    renderInRouter(
      <RouteLink
        variant="quick-link"
        to={toRoutePath("/reports")}
        icon={Home}
        label="Reports"
        description="All reports"
      />,
    );

    const link = await screen.findByRole("link", { name: /Reports/ });
    expect(link.textContent).toContain("All reports");
  });

  it("renders the side-bar-nav-link variant with the nav-link class", async () => {
    renderInRouter(
      <RouteLink
        variant="side-bar-nav-link"
        to={toRoutePath("/")}
        icon={Home}
        label="Home"
        navVariant="sidebar"
      />,
    );

    const link = await screen.findByRole("link", { name: "Home" });
    expect(link.className).toContain("group");
  });
});
