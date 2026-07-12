import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ActivityFeed, type ActivityFeedItem } from "./index";

afterEach(cleanup);

const items: ActivityFeedItem[] = [
  { id: "a", title: "Record created", timestamp: "09:12", tone: "primary" },
  { id: "b", title: "Document uploaded", description: "statement.pdf", timestamp: "10:04" },
  { id: "c", title: "Approval granted", timestamp: "11:30", tone: "success" },
];

describe("ActivityFeed", () => {
  it("renders entries as an ordered list", () => {
    render(<ActivityFeed items={items} ariaLabel="Recent activity" />);

    const list = screen.getByRole("list", { name: "Recent activity" });
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Document uploaded")).toBeTruthy();
    expect(screen.getByText("statement.pdf")).toBeTruthy();
  });

  it("renders the zero-state when there are no entries", () => {
    render(<ActivityFeed items={[]} />);

    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("No activity yet.")).toBeTruthy();
  });

  it("renders a custom zero-state", () => {
    render(<ActivityFeed items={[]} emptyState="Nothing here." />);

    expect(screen.getByText("Nothing here.")).toBeTruthy();
  });

  it("hides connectors when requested", () => {
    render(<ActivityFeed items={items} showConnectors={false} />);

    const firstItem = screen.getByText("Record created").closest("li");
    expect(firstItem?.className).toContain("before:hidden");
  });
});
