import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollArea, ScrollBar, scrollAreaVariants, scrollBarVariants } from "./index";

describe("ScrollArea", () => {
  it("renders children inside the viewport", () => {
    render(
      <ScrollArea className="h-40" data-testid="scroll-root">
        <p>Row one</p>
        <p>Row two</p>
      </ScrollArea>,
    );
    expect(screen.getByText("Row one")).toBeTruthy();
    expect(screen.getByText("Row two")).toBeTruthy();
  });

  it("merges the base variant classes with a custom className", () => {
    render(
      <ScrollArea className="h-40" data-testid="scroll-root">
        content
      </ScrollArea>,
    );
    const root = screen.getByTestId("scroll-root");
    expect(root.className).toContain(scrollAreaVariants());
    expect(root.className).toContain("h-40");
  });

  it("exposes orientation variants for the scrollbar", () => {
    expect(scrollBarVariants({ orientation: "vertical" })).toContain("w-2.5");
    expect(scrollBarVariants({ orientation: "horizontal" })).toContain("flex-col");
  });

  it("renders an explicit horizontal scrollbar", () => {
    render(
      <ScrollArea className="w-40" type="always">
        <div style={{ width: 600 }}>wide content</div>
        <ScrollBar orientation="horizontal" data-testid="hbar" forceMount />
      </ScrollArea>,
    );
    const bar = screen.getByTestId("hbar");
    expect(bar.getAttribute("data-orientation")).toBe("horizontal");
    expect(bar.className).toContain("flex-col");
  });
});
