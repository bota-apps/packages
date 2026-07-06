import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeToggleIcon } from "./index";

afterEach(cleanup);

describe("ThemeToggleIcon", () => {
  it("renders both the sun and moon icons", () => {
    const { container } = render(<ThemeToggleIcon />);
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBe(2);
  });

  it("shows the sun in light mode and swaps to the moon in dark mode via classes", () => {
    const { container } = render(<ThemeToggleIcon />);
    const [sun, moon] = Array.from(container.querySelectorAll("svg"));
    expect(sun.getAttribute("class")).toContain("scale-100");
    expect(sun.getAttribute("class")).toContain("dark:scale-0");
    expect(moon.getAttribute("class")).toContain("scale-0");
    expect(moon.getAttribute("class")).toContain("dark:scale-100");
  });
});
