import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Separator } from "./index";

afterEach(cleanup);

describe("Separator", () => {
  it("renders horizontally by default and merges className", () => {
    const { container } = render(<Separator className="my-4" />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute("data-orientation")).toBe("horizontal");
    expect(el.className).toContain("h-[1px]");
    expect(el.className).toContain("my-4");
  });

  it("applies the vertical orientation variant classes", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute("data-orientation")).toBe("vertical");
    expect(el.className).toContain("w-[1px]");
  });
});
