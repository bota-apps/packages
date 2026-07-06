import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarChart } from "./index";
import type { ChartSeriesConfig } from "../chartConfig";

// The container measures 0×0 in jsdom, so the SVG plot stays empty; the smoke
// test asserts the chrome around it (title, legend).
const data = [
  { department: "Engineering", completed: 24, open: 4 },
  { department: "Sales", completed: 18, open: 6 },
];

const series: ChartSeriesConfig[] = [
  { dataKey: "completed", label: "Completed" },
  { dataKey: "open", label: "Open tasks" },
];

describe("BarChart", () => {
  it("renders the title and a legend for multi-series data", () => {
    render(<BarChart data={data} categoryKey="department" series={series} title="Tasks by team" />);

    expect(screen.getByText("Tasks by team")).toBeTruthy();
    expect(screen.getByText("Completed")).toBeTruthy();
    expect(screen.getByText("Open tasks")).toBeTruthy();
  });

  it("omits the legend for a single series", () => {
    render(
      <BarChart data={data} categoryKey="department" series={[series[0]]} layout="vertical" />,
    );

    expect(screen.queryByText("Completed")).not.toBeTruthy();
  });
});
