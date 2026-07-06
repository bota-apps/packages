import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NumericText } from "./index";

afterEach(cleanup);

describe("NumericText", () => {
  it("formats counts with grouping separators", () => {
    render(<NumericText value={1234} variant="count" />);
    expect(screen.getByText("1,234")).toBeTruthy();
  });

  it("formats percentages with the requested decimals", () => {
    render(<NumericText value={12.5} variant="percent" />);
    expect(screen.getByText("12.5%")).toBeTruthy();
  });

  it("formats ordinals", () => {
    render(<NumericText value={3} variant="ordinal" />);
    expect(screen.getByText("3rd")).toBeTruthy();
  });

  it("applies tone, size, and weight variant classes", () => {
    render(<NumericText value={7} tone="success" size="xl" weight="bold" />);
    const el = screen.getByText("7");
    expect(el.className).toContain("tabular-nums");
    expect(el.className).toContain("text-chart-2");
    expect(el.className).toContain("text-2xl");
    expect(el.className).toContain("font-bold");
  });
});
