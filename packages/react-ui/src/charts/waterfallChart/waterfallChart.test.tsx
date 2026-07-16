import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WaterfallChart, type WaterfallDatum } from "./index";

// The container measures 0×0 in jsdom, so the SVG plot stays empty; the tests
// assert the accessible chrome around it (aria-label, data table).
const data: WaterfallDatum[] = [
  { id: "opening", label: "Opening", value: 1200, kind: "total" },
  { id: "additions", label: "Additions", value: 480 },
  { id: "adjustmentA", label: "Adjustment A", value: -260 },
  { id: "adjustmentB", label: "Adjustment B", value: 150 },
  { id: "deductions", label: "Deductions", value: -320 },
  { id: "closing", label: "Closing", value: 1250, kind: "total" },
];

const plain = (value: number) => String(value);

describe("WaterfallChart", () => {
  it("renders with an accessible chart image label", () => {
    render(<WaterfallChart data={data} ariaLabel="Value bridge" />);
    expect(screen.getByRole("img", { name: "Value bridge" })).toBeTruthy();
  });

  it("falls back to a default aria-label when none is given", () => {
    render(<WaterfallChart data={data} />);
    expect(screen.getByRole("img", { name: "Waterfall chart" })).toBeTruthy();
  });

  it("renders the accessible table with every step and its signed change", () => {
    render(<WaterfallChart data={data} valueFormatter={plain} showDataTable />);
    const table = screen.getByRole("table");
    const scoped = within(table);

    for (const datum of data) {
      expect(scoped.getByText(datum.label)).toBeTruthy();
    }
    // Signed deltas are distinguishable beyond color, in text.
    expect(scoped.getByText("Increase +480")).toBeTruthy();
    expect(scoped.getByText("Decrease -260")).toBeTruthy();
    expect(scoped.getByText("Increase +150")).toBeTruthy();
    expect(scoped.getByText("Decrease -320")).toBeTruthy();
    expect(scoped.getByText("Total 1250")).toBeTruthy();
  });

  it("computes running totals correctly for a known dataset", () => {
    render(<WaterfallChart data={data} valueFormatter={plain} showDataTable />);
    const rows = screen.getAllByRole("row");
    // Header row + one row per datum.
    expect(rows).toHaveLength(data.length + 1);

    // Running totals: 1200, 1680, 1420, 1570, 1250, 1250.
    const expectedRunningTotals = ["1200", "1680", "1420", "1570", "1250", "1250"];
    data.forEach((datum, index) => {
      const row = within(rows[index + 1]);
      expect(row.getByText(datum.label)).toBeTruthy();
      expect(row.getByText(expectedRunningTotals[index])).toBeTruthy();
    });
  });

  it("applies the injected value formatter to running totals", () => {
    const formatter = (value: number) => `${value} pts`;
    render(<WaterfallChart data={data} valueFormatter={formatter} showDataTable />);
    const table = screen.getByRole("table");
    // Opening total's running total, formatted.
    expect(within(table).getByText("1200 pts")).toBeTruthy();
    // Closing total's running total, formatted.
    expect(within(table).getAllByText("1250 pts").length).toBeGreaterThan(0);
  });

  it("keeps the data table screen-reader-only unless asked to show it", () => {
    const { container } = render(<WaterfallChart data={data} />);
    const table = screen.getByRole("table");
    const wrapper = container.querySelector(".sr-only");
    expect(wrapper).toBeTruthy();
    expect(wrapper?.contains(table)).toBe(true);
  });
});
