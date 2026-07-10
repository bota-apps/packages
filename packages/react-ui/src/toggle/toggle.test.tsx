import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toggle, toggleVariants } from "./index";

afterEach(cleanup);

describe("Toggle", () => {
  it("toggles pressed state on click", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    await user.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("applies variant and size classes and merges className", () => {
    render(
      <Toggle variant="outline" size="sm" className="custom-class">
        Italic
      </Toggle>,
    );
    const button = screen.getByRole("button", { name: "Italic" });
    expect(button.className).toContain("border-input");
    expect(button.className).toContain("h-8");
    expect(button.className).toContain("custom-class");
  });

  it("exports toggleVariants for external composition", () => {
    expect(toggleVariants({ variant: "outline" })).toContain("border-input");
    expect(toggleVariants({ size: "lg" })).toContain("h-10");
  });

  it("styles the on state with the selected tokens, never accent", () => {
    const base = toggleVariants();
    expect(base).toContain("data-[state=on]:bg-selected");
    expect(base).toContain("data-[state=on]:text-selected-foreground");
    expect(base).not.toContain("bg-accent");
    expect(toggleVariants({ variant: "outline" })).toContain("data-[state=on]:border-primary/40");
  });
});
