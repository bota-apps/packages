import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Progress } from "./index";

afterEach(cleanup);

describe("Progress", () => {
  it("renders a progressbar with base classes and className merge", () => {
    render(<Progress value={40} className="w-80" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.className).toContain("rounded-full");
    expect(bar.className).toContain("w-80");
  });

  it("translates the indicator by the remaining percentage", () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole("progressbar");
    const indicator = bar.firstChild as HTMLElement;
    expect(indicator.style.transform).toBe("translateX(-60%)");
  });
});
