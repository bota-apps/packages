import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StackedBar } from "./index";

const segments = [
  { key: "engineering", value: 30, color: "bg-chart-1", label: "Engineering" },
  { key: "operations", value: 10, color: "bg-chart-2", label: "Operations" },
];

afterEach(cleanup);

describe("StackedBar", () => {
  it("renders one proportional segment per non-zero value", () => {
    const { container } = render(<StackedBar segments={segments} />);
    const bar = container.querySelector("div.flex") as HTMLElement;
    // Default height variant is md.
    expect(bar.className).toContain("h-3");
    const spans = bar.querySelectorAll("span");
    expect(spans.length).toBe(2);
    expect((spans[0] as HTMLElement).style.width).toBe("75%");
    expect((spans[1] as HTMLElement).style.width).toBe("25%");
    expect((spans[0] as HTMLElement).className).toContain("rounded-l-full");
    expect((spans[1] as HTMLElement).className).toContain("rounded-r-full");
  });

  it("applies the height variant class from stackedBarVariants", () => {
    const { container } = render(<StackedBar segments={segments} height="lg" />);
    expect((container.querySelector("div.flex") as HTMLElement).className).toContain("h-4");
  });

  it("renders nothing when all segment values are zero", () => {
    const { container } = render(
      <StackedBar segments={[{ key: "a", value: 0, color: "bg-chart-1", label: "A" }]} />,
    );
    expect(container.firstChild).toBe(null);
  });
});
