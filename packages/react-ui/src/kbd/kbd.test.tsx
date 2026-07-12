import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Kbd, kbdVariants } from "./index";

afterEach(cleanup);

describe("Kbd", () => {
  it("renders a kbd element with the key label and default size classes", () => {
    render(<Kbd>Enter</Kbd>);
    const el = screen.getByText("Enter");
    expect(el.tagName).toBe("KBD");
    expect(el.className).toContain("font-mono");
    expect(el.className).toContain("shadow-raised");
    expect(el.className).toContain("text-xs");
  });

  it("applies the sm size variant classes", () => {
    render(<Kbd size="sm">K</Kbd>);
    const el = screen.getByText("K");
    expect(el.className).toContain("text-[10px]");
    expect(el.className).not.toContain("text-xs");
    expect(kbdVariants({ size: "sm" })).toContain("px-1");
  });
});
