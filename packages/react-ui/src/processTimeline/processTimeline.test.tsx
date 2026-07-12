import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProcessTimeline, type ProcessTimelineItem } from "./index";

afterEach(cleanup);

const items: ProcessTimelineItem[] = [
  { id: "draft", label: "Draft", status: "complete", timestamp: "Jun 24" },
  { id: "review", label: "In review", status: "current", description: "Awaiting approval." },
  { id: "publish", label: "Published", status: "upcoming" },
];

describe("ProcessTimeline", () => {
  it("renders items as an ordered list in order", () => {
    render(<ProcessTimeline items={items} ariaLabel="Lifecycle" />);

    const list = screen.getByRole("list", { name: "Lifecycle" });
    expect(list.tagName).toBe("OL");
    const entries = within(list).getAllByRole("listitem");
    expect(entries.map((entry) => entry.textContent)).toEqual([
      expect.stringContaining("Draft"),
      expect.stringContaining("In review"),
      expect.stringContaining("Published"),
    ]);
  });

  it("marks the current step with aria-current='step'", () => {
    render(<ProcessTimeline items={items} />);

    const current = screen.getByText("In review").closest("li");
    expect(current?.getAttribute("aria-current")).toBe("step");
    const complete = screen.getByText("Draft").closest("li");
    expect(complete?.getAttribute("aria-current")).toBeNull();
  });

  it("exposes each item's status as accessible text, not color alone", () => {
    render(<ProcessTimeline items={items} />);

    // Default English status labels render (visually hidden) beside each label.
    expect(screen.getByText("— Complete")).toBeTruthy();
    expect(screen.getByText("— Current")).toBeTruthy();
    expect(screen.getByText("— Upcoming")).toBeTruthy();
  });

  it("honors injected status labels", () => {
    render(<ProcessTimeline items={items} statusLabels={{ complete: "Done" }} />);

    expect(screen.getByText("— Done")).toBeTruthy();
    // Unspecified statuses keep their English defaults (per-key merge).
    expect(screen.getByText("— Current")).toBeTruthy();
  });

  it("renders no buttons when non-interactive", () => {
    render(<ProcessTimeline items={items} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders keyboard-operable buttons and reports the selected id", () => {
    const onItemSelect = vi.fn();
    render(<ProcessTimeline items={items} onItemSelect={onItemSelect} selectedItemId="review" />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    const selected = buttons.find((button) => button.getAttribute("aria-pressed") === "true");
    expect(selected?.textContent).toContain("In review");

    fireEvent.click(screen.getByText("Published").closest("button") as HTMLButtonElement);
    expect(onItemSelect).toHaveBeenCalledWith("publish");
  });

  it("renders blocked and skipped statuses", () => {
    render(
      <ProcessTimeline
        items={[
          { id: "a", label: "Prepared", status: "complete" },
          { id: "b", label: "Held", status: "blocked" },
          { id: "c", label: "Bypassed", status: "skipped" },
        ]}
      />,
    );

    expect(screen.getByText("— Blocked")).toBeTruthy();
    expect(screen.getByText("— Skipped")).toBeTruthy();
  });

  it("renders a compact step summary when horizontal", () => {
    render(<ProcessTimeline items={items} orientation="horizontal" />);

    // The @2xl:hidden summary node is present in the DOM (visibility is CSS).
    expect(screen.getByText(/Step 2 of 3 —/)).toBeTruthy();
  });

  it("localizes the compact horizontal summary via summaryLabel", () => {
    render(
      <ProcessTimeline
        items={items}
        orientation="horizontal"
        summaryLabel={(step, total, label) => `Étape ${step} / ${total} — ${label}`}
      />,
    );

    expect(screen.getByText("Étape 2 / 3 — In review")).toBeTruthy();
    expect(screen.queryByText(/Step 2 of 3 —/)).toBeNull();
  });
});
