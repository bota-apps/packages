import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { CircleCheck, Users } from "lucide-react";
import { describe, expect, it } from "vitest";
import { RouteActionCenter, type RouteAction } from "./index";
import { toRoutePath } from "../routeLink";

// RouteActionCenter renders router <Link>s, so every test hosts it in a minimal
// in-memory router.
function renderInRouter(ui: React.ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

const actions: readonly RouteAction[] = [
  {
    id: "records",
    label: "Review records",
    description: "Items awaiting review",
    icon: <CircleCheck data-testid="records-icon" />,
    tone: "primary",
    to: toRoutePath("/records"),
  },
  {
    id: "people",
    label: "Invite a teammate",
    icon: <Users />,
    to: toRoutePath("/people"),
  },
];

describe("RouteActionCenter", () => {
  it("renders each action as a link with its route href and label", async () => {
    renderInRouter(<RouteActionCenter actions={actions} ariaLabel="Next actions" />);

    const records = await screen.findByRole("link", { name: /Review records/ });
    expect(records.getAttribute("href")).toBe("/records");
    expect(records.textContent).toContain("Items awaiting review");

    const people = await screen.findByRole("link", { name: /Invite a teammate/ });
    expect(people.getAttribute("href")).toBe("/people");
  });

  it("exposes the list under the provided aria-label", async () => {
    renderInRouter(<RouteActionCenter actions={actions} ariaLabel="Next actions" />);

    const list = await screen.findByRole("list", { name: "Next actions" });
    expect(list.querySelectorAll("li")).toHaveLength(2);
  });

  it("applies the tone tint to the icon chip", async () => {
    renderInRouter(<RouteActionCenter actions={actions} />);

    const icon = await screen.findByTestId("records-icon");
    const chip = icon.parentElement;
    expect(chip?.className).toContain("bg-selected");
  });

  it("renders a trailing node in place of the chevron when provided", async () => {
    renderInRouter(
      <RouteActionCenter
        actions={[
          {
            id: "records",
            label: "Open records",
            to: toRoutePath("/records"),
            trailing: <span data-testid="badge">7</span>,
          },
        ]}
      />,
    );

    const badge = await screen.findByTestId("badge");
    expect(badge.textContent).toBe("7");
  });

  it("renders the zero-state message when there are no actions", async () => {
    renderInRouter(<RouteActionCenter actions={[]} emptyState="Nothing to do" />);

    expect(await screen.findByText("Nothing to do")).toBeDefined();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
