import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToggleGroup, ToggleGroupItem, toggleGroupVariants } from "./index";

afterEach(cleanup);

describe("ToggleGroup", () => {
  it("selects a single item at a time", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    );
    const left = screen.getByRole("radio", { name: "Left" });
    const right = screen.getByRole("radio", { name: "Right" });
    await user.click(left);
    expect(onValueChange).toHaveBeenCalledWith("left");
    expect(left.getAttribute("data-state")).toBe("on");
    await user.click(right);
    expect(right.getAttribute("data-state")).toBe("on");
    expect(left.getAttribute("data-state")).toBe("off");
  });

  it("applies the group layout variant and passes item variants via context", () => {
    render(
      <ToggleGroup type="multiple" variant="outline" size="sm" data-testid="group">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      </ToggleGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group.className).toContain(toggleGroupVariants());
    const item = screen.getByRole("button", { name: "Bold" });
    expect(item.className).toContain("border-input");
    expect(item.className).toContain("h-8");
  });
});
