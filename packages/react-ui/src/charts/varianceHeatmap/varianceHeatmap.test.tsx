import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { VarianceHeatmap, type HeatmapCell, type VarianceHeatmapHeader } from "./index";

afterEach(cleanup);

const rows: VarianceHeatmapHeader[] = [
  { id: "a", label: "Group A" },
  { id: "b", label: "Group B" },
];

const columns: VarianceHeatmapHeader[] = [
  { id: "p1", label: "Period 1" },
  { id: "p2", label: "Period 2" },
];

function cellsFrom(
  data: Record<string, Record<string, number | undefined>>,
): (rowId: string, colId: string) => HeatmapCell | undefined {
  return (rowId, colId) => {
    const value = data[rowId]?.[colId];
    return value === undefined ? undefined : { value };
  };
}

const grid = cellsFrom({
  a: { p1: 12, p2: -6 },
  b: { p1: 0, p2: 8 },
});

describe("VarianceHeatmap", () => {
  it("renders a table with column and row headers", () => {
    render(<VarianceHeatmap rows={rows} columns={columns} getCell={grid} ariaLabel="Variance" />);

    const table = screen.getByRole("table", { name: "Variance" });
    expect(within(table).getByRole("columnheader", { name: "Period 1" })).toBeTruthy();
    expect(within(table).getByRole("columnheader", { name: "Period 2" })).toBeTruthy();
    expect(within(table).getByRole("rowheader", { name: "Group A" })).toBeTruthy();
    expect(within(table).getByRole("rowheader", { name: "Group B" })).toBeTruthy();
  });

  it("shows each cell's value as text, not color only", () => {
    render(<VarianceHeatmap rows={rows} columns={columns} getCell={grid} />);

    expect(screen.getByText("+12")).toBeTruthy();
    expect(screen.getByText("−6")).toBeTruthy();
    expect(screen.getByText("0")).toBeTruthy();
    expect(screen.getByText("+8")).toBeTruthy();
  });

  it("tints negative and positive cells with different token classes", () => {
    render(<VarianceHeatmap rows={rows} columns={columns} getCell={grid} />);

    const positive = screen.getByRole("cell", { name: "Group A, Period 1: +12" });
    const negative = screen.getByRole("cell", { name: "Group A, Period 2: −6" });
    expect(positive.className).toContain("bg-emerald-500");
    expect(negative.className).toContain("bg-destructive");
    expect(positive.className).not.toContain("bg-destructive");
  });

  it("gives every cell an accessible label", () => {
    render(<VarianceHeatmap rows={rows} columns={columns} getCell={grid} />);

    expect(screen.getByRole("cell", { name: "Group B, Period 2: +8" })).toBeTruthy();
    expect(screen.getByRole("cell", { name: "Group A, Period 1: +12" })).toBeTruthy();
  });

  it("applies the injected value formatter", () => {
    render(
      <VarianceHeatmap
        rows={rows}
        columns={columns}
        getCell={grid}
        valueFormatter={(value) => `${value}%`}
      />,
    );

    expect(screen.getByText("12%")).toBeTruthy();
    expect(screen.getByRole("cell", { name: "Group A, Period 1: 12%" })).toBeTruthy();
  });

  it("renders empty cells with a no-data label", () => {
    const sparse = cellsFrom({ a: { p1: 5 }, b: {} });
    render(<VarianceHeatmap rows={rows} columns={columns} getCell={sparse} emptyLabel="—" />);

    expect(screen.getByRole("cell", { name: "Group A, Period 2: —" })).toBeTruthy();
    expect(screen.getByRole("cell", { name: "Group B, Period 1: —" })).toBeTruthy();
  });

  it("renders the color-scale legend by default and hides it when asked", () => {
    const { rerender } = render(<VarianceHeatmap rows={rows} columns={columns} getCell={grid} />);
    expect(screen.getByRole("list", { name: "Variance color scale" })).toBeTruthy();

    rerender(<VarianceHeatmap rows={rows} columns={columns} getCell={grid} showLegend={false} />);
    expect(screen.queryByRole("list", { name: "Variance color scale" })).toBeNull();
  });
});
