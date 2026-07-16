import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { ArrowRight } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActionCenter, type ActionCenterAction } from "./index";

afterEach(cleanup);

const actions: ActionCenterAction[] = [
  {
    id: "prepare",
    label: "Prepare the next item",
    description: "3 pending",
    tone: "primary",
    onSelect: vi.fn(),
  },
  { id: "review", label: "Review flagged entries", tone: "warning", onSelect: vi.fn() },
  { id: "static", label: "Read-only note" },
];

describe("ActionCenter", () => {
  it("renders actions as a list", () => {
    render(<ActionCenter actions={actions} ariaLabel="Next actions" />);

    const list = screen.getByRole("list", { name: "Next actions" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Prepare the next item")).toBeTruthy();
    expect(screen.getByText("3 pending")).toBeTruthy();
  });

  it("renders actionable items as buttons and reports selection", () => {
    const onSelect = vi.fn();
    render(<ActionCenter actions={[{ id: "go", label: "Do it", onSelect }]} />);

    fireEvent.click(screen.getByRole("button", { name: /Do it/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders non-actionable items without a button", () => {
    render(<ActionCenter actions={[{ id: "static", label: "Just text" }]} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Just text")).toBeTruthy();
  });

  it("prefers a trailing node over the default chevron", () => {
    render(
      <ActionCenter
        actions={[
          {
            id: "go",
            label: "With trailing",
            onSelect: vi.fn(),
            trailing: <ArrowRight aria-label="go" />,
          },
        ]}
      />,
    );

    expect(screen.getByLabelText("go")).toBeTruthy();
  });

  it("renders the zero-state when empty", () => {
    render(<ActionCenter actions={[]} />);

    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("No actions right now.")).toBeTruthy();
  });
});
