import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DonutChart, PieChart } from "./index";
import type { ChartDataEntry } from "../chartConfig";

// The container measures 0×0 in jsdom, so the SVG plot stays empty; the smoke
// test asserts the chrome around it (title, legend).
const data: ChartDataEntry[] = [
  { label: "Development", value: 62000 },
  { label: "Design", value: 18000 },
  { label: "Other", value: 5500 },
];

describe("PieChart", () => {
  it("renders the title and a legend entry per slice", () => {
    render(<PieChart data={data} title="Cost breakdown" />);

    expect(screen.getByText("Cost breakdown")).toBeTruthy();
    for (const entry of data) {
      expect(screen.getByText(entry.label)).toBeTruthy();
    }
  });
});

describe("DonutChart", () => {
  it("renders the legend for donut mode", () => {
    render(<DonutChart data={data} centerLabel="Total" />);

    expect(screen.getByText("Development")).toBeTruthy();
    expect(screen.getByText("Design")).toBeTruthy();
  });
});
