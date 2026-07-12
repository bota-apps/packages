import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocumentChecklist, type DocumentChecklistItem } from "./index";

afterEach(cleanup);

const items: DocumentChecklistItem[] = [
  { id: "identity", label: "Identity document", status: "provided", required: true },
  { id: "address", label: "Proof of address", status: "missing", required: true },
  { id: "agreement", label: "Signed agreement", status: "pending", required: true },
  { id: "statement", label: "Supporting statement", status: "missing", required: false },
];

describe("DocumentChecklist", () => {
  it("renders each item with a worded status, not color alone", () => {
    render(<DocumentChecklist ariaLabel="Documents" items={items} />);

    expect(screen.getByText("Identity document")).toBeTruthy();
    expect(screen.getByText("Required · Provided")).toBeTruthy();
    expect(screen.getByText("Required · Missing")).toBeTruthy();
    expect(screen.getByText("Required · Pending")).toBeTruthy();
    expect(screen.getByText("Optional · Missing")).toBeTruthy();
  });

  it("states overall completeness in words for required documents", () => {
    render(<DocumentChecklist items={items} />);

    // 3 required documents, 1 provided.
    expect(screen.getByText("1 of 3 provided")).toBeTruthy();
  });

  it("renders a progress bar reflecting provided vs required documents", () => {
    render(<DocumentChecklist items={items} />);

    // 1/3 → 33% provided, so the indicator is translated back by 67%.
    const indicator = screen.getByRole("progressbar").firstChild as HTMLElement;
    expect(indicator.style.transform).toBe("translateX(-67%)");
  });

  it("hides progress when showProgress is false", () => {
    render(<DocumentChecklist items={items} showProgress={false} />);

    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText("1 of 3 provided")).toBeNull();
  });

  it("makes items with onSelect keyboard-operable and reports selection", () => {
    const onSelect = vi.fn();
    render(
      <DocumentChecklist
        items={[{ id: "identity", label: "Identity document", status: "missing", onSelect }]}
      />,
    );

    const button = screen.getByRole("button", { name: /Identity document/ });
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders items without onSelect as static rows, not buttons", () => {
    render(<DocumentChecklist items={items} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders a clean zero-state when there are no documents", () => {
    render(<DocumentChecklist items={[]} />);

    expect(screen.getByText("No documents required.")).toBeTruthy();
    expect(screen.queryByRole("listitem")).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });
});
