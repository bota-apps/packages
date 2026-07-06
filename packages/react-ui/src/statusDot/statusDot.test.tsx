import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusDot } from "./index";

afterEach(cleanup);

describe("StatusDot", () => {
  it("renders with gray/sm defaults", () => {
    const { container } = render(<StatusDot />);
    const dot = container.firstChild as HTMLElement;
    expect(dot.className).toContain("bg-gray-400");
    expect(dot.className).toContain("h-1.5");
  });

  it("applies status and size variant classes from statusDotVariants", () => {
    const { container } = render(<StatusDot status="green" size="md" />);
    const dot = container.firstChild as HTMLElement;
    expect(dot.className).toContain("bg-emerald-500");
    expect(dot.className).toContain("h-2");
  });
});
