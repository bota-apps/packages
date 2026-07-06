import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaChart } from "./index";
import type { ChartSeriesConfig } from "../chartConfig";

// The container measures 0×0 in jsdom, so the SVG plot stays empty; the smoke
// test asserts the chrome around it (title, legend).
const data = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 3800, expenses: 2210 },
];

const series: ChartSeriesConfig[] = [
  { dataKey: "revenue", label: "Revenue" },
  { dataKey: "expenses", label: "Expenses" },
];

describe("AreaChart", () => {
  it("renders the title and a legend for multi-series data", () => {
    render(<AreaChart data={data} categoryKey="month" series={series} title="Cash flow" />);

    expect(screen.getByText("Cash flow")).toBeTruthy();
    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("Expenses")).toBeTruthy();
  });

  it("omits the legend for a single series", () => {
    render(<AreaChart data={data} categoryKey="month" series={[series[0]]} />);

    expect(screen.queryByText("Revenue")).not.toBeTruthy();
  });
});
