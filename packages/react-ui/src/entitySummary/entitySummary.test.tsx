import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { EntitySummary, type EntitySummaryItem } from "./index";

afterEach(cleanup);

const items: EntitySummaryItem[] = [
  { id: "reference", label: "Reference", value: "REF-1042" },
  { id: "status", label: "Status", value: "Active" },
  { id: "note", label: "Note", value: "A longer free-text value.", full: true },
];

describe("EntitySummary", () => {
  it("renders a description list with dt/dd pairs", () => {
    const { container } = render(<EntitySummary items={items} ariaLabel="Overview" />);

    const dl = container.querySelector("dl");
    expect(dl).toBeTruthy();
    expect(dl?.getAttribute("aria-label")).toBe("Overview");
    expect(container.querySelectorAll("dt")).toHaveLength(3);
    expect(container.querySelectorAll("dd")).toHaveLength(3);
    expect(screen.getByText("Reference")).toBeTruthy();
    expect(screen.getByText("REF-1042")).toBeTruthy();
  });

  it("spans full-width items across the grid", () => {
    render(<EntitySummary items={items} />);

    const noteCell = screen.getByText("Note").closest("div");
    expect(noteCell?.className).toContain("col-span-full");
    const statusCell = screen.getByText("Status").closest("div");
    expect(statusCell?.className).not.toContain("col-span-full");
  });

  it("reflows by container width, not viewport", () => {
    const { container } = render(<EntitySummary items={items} columns={3} />);

    // The @container wrapper scopes the query; the grid uses container variants.
    expect(container.firstElementChild?.className).toContain("@container");
    expect(container.querySelector("dl")?.className).toContain("@xl:grid-cols-2");
  });
});
