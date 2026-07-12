import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReadinessSummary, type ReadinessGroup } from "./index";

afterEach(cleanup);

const groups: ReadinessGroup[] = [
  {
    id: "records",
    title: "Records",
    issues: [
      { id: "missing", label: "2 records missing details", severity: "error" },
      { id: "review", label: "1 record needs review", severity: "warning" },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    issues: [{ id: "doc", label: "Attachment not provided", severity: "info" }],
  },
];

describe("ReadinessSummary", () => {
  it("renders grouped issues with worded counts, not color alone", () => {
    render(
      <ReadinessSummary title="Readiness" progress={{ complete: 5, total: 8 }} groups={groups} />,
    );

    expect(screen.getByText("5 of 8 complete")).toBeTruthy();
    expect(screen.getByText("Records")).toBeTruthy();
    expect(screen.getByText("2 records missing details")).toBeTruthy();
    expect(screen.getByText("Attachment not provided")).toBeTruthy();
  });

  it("renders a progress bar reflecting completion", () => {
    render(<ReadinessSummary progress={{ complete: 5, total: 8 }} groups={groups} />);

    // 5/8 → 63% complete, so the indicator is translated back by 37%.
    const indicator = screen.getByRole("progressbar").firstChild as HTMLElement;
    expect(indicator.style.transform).toBe("translateX(-37%)");
  });

  it("shows a positive zero-state when nothing is outstanding", () => {
    render(<ReadinessSummary title="Readiness" groups={[{ id: "g", issues: [] }]} />);

    expect(screen.getByText("Everything looks ready.")).toBeTruthy();
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("makes actionable issues keyboard-operable and reports selection", () => {
    const onSelect = vi.fn();
    render(
      <ReadinessSummary
        groups={[{ id: "g", issues: [{ id: "fix", label: "Fix this", onSelect }] }]}
      />,
    );

    const button = screen.getByRole("button", { name: /Fix this/ });
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders non-actionable issues without buttons", () => {
    render(<ReadinessSummary groups={groups} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
