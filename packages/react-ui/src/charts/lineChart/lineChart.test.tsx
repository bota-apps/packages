import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LineChart } from "./index";
import type { ChartSeriesConfig } from "../chartConfig";

// The container measures 0×0 in jsdom, so the SVG plot stays empty; the smoke
// test asserts the chrome around it (title, legend).
const data = [
  { week: "W1", active: 320, new: 40 },
  { week: "W2", active: 355, new: 52 },
];

const series: ChartSeriesConfig[] = [
  { dataKey: "active", label: "Active users" },
  { dataKey: "new", label: "New signups" },
];

describe("LineChart", () => {
  it("renders the title and a legend for multi-series data", () => {
    render(<LineChart data={data} categoryKey="week" series={series} title="Weekly usage" />);

    expect(screen.getByText("Weekly usage")).toBeTruthy();
    expect(screen.getByText("Active users")).toBeTruthy();
    expect(screen.getByText("New signups")).toBeTruthy();
  });

  it("omits the legend for a single series", () => {
    render(<LineChart data={data} categoryKey="week" series={[series[0]]} curved={false} />);

    expect(screen.queryByText("Active users")).not.toBeTruthy();
  });
});
