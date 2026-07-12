import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RouteDiagram, type RouteLeg, type RouteNode } from "./index";

afterEach(cleanup);

const nodes: RouteNode[] = [
  { id: "origin", label: "Origin", sublabel: "Stage A", status: "complete" },
  { id: "hub", label: "Hub", sublabel: "Stage B", status: "current" },
  { id: "destination", label: "Destination", sublabel: "Stage C", status: "upcoming" },
];

const legs: RouteLeg[] = [
  { id: "leg1", from: "origin", to: "hub", label: "Segment 1", status: "complete" },
  { id: "leg2", from: "hub", to: "destination", label: "Segment 2", status: "upcoming" },
];

describe("RouteDiagram", () => {
  it("renders the nodes and legs", () => {
    const { container } = render(
      <RouteDiagram nodes={nodes} legs={legs} ariaLabel="Staged journey" />,
    );

    // Node labels appear in the diagram (as SVG <text>).
    expect(screen.getAllByText("Origin").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Hub").length).toBeGreaterThan(0);
    // Leg labels appear in the diagram.
    expect(screen.getAllByText("Segment 1").length).toBeGreaterThan(0);
    // The geometry is drawn as an SVG.
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("exposes a semantic ordered summary listing the legs in order", () => {
    render(<RouteDiagram nodes={nodes} legs={legs} ariaLabel="Staged journey" />);

    const list = screen.getByRole("list", { name: "Staged journey" });
    expect(list.tagName).toBe("OL");
    const entries = within(list).getAllByRole("listitem");
    expect(entries).toHaveLength(2);
    expect(entries[0].textContent).toContain("Origin");
    expect(entries[0].textContent).toContain("to");
    expect(entries[0].textContent).toContain("Hub");
    expect(entries[0].textContent).toContain("Segment 1");
    // Order is preserved: leg 2 follows leg 1.
    expect(entries[1].textContent).toContain("Destination");
  });

  it("applies the aria-label to the summary list", () => {
    render(<RouteDiagram nodes={nodes} legs={legs} ariaLabel="Route to destination" />);

    expect(screen.getByRole("list", { name: "Route to destination" })).toBeTruthy();
  });

  it("switches to a vertical layout in narrow containers via a container-query class", () => {
    const { container } = render(
      <RouteDiagram nodes={nodes} legs={legs} ariaLabel="Staged journey" />,
    );

    // Horizontal (default) renders both layouts, toggled by an `@md` container query.
    expect(container.innerHTML).toContain("@md:hidden");
    expect(container.innerHTML).toContain("@md:block");
  });

  it("signals node status with text, not colour alone", () => {
    render(<RouteDiagram nodes={nodes} legs={legs} ariaLabel="Staged journey" />);

    // Every node carries a visible status caption (default English labels).
    expect(screen.getAllByText("Complete").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Current").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Upcoming").length).toBeGreaterThan(0);
  });

  it("honours injected status labels", () => {
    render(
      <RouteDiagram
        nodes={nodes}
        legs={legs}
        ariaLabel="Staged journey"
        statusLabels={{ complete: "Done" }}
      />,
    );

    expect(screen.getAllByText("Done").length).toBeGreaterThan(0);
    // Unspecified statuses keep their English defaults (per-key merge).
    expect(screen.getAllByText("Current").length).toBeGreaterThan(0);
  });

  it("renders only the vertical layout when orientation is vertical", () => {
    const { container } = render(
      <RouteDiagram nodes={nodes} legs={legs} orientation="vertical" ariaLabel="Staged journey" />,
    );

    // No horizontal/narrow toggle wrappers when explicitly vertical.
    expect(container.innerHTML).not.toContain("@md:hidden");
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  it("throws when a leg references an unknown node id", () => {
    expect(() =>
      render(
        <RouteDiagram
          nodes={nodes}
          legs={[{ id: "bad", from: "origin", to: "nowhere" }]}
          ariaLabel="Staged journey"
        />,
      ),
    ).toThrow(/unknown node id/);
  });
});
