import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Label } from "../label";
import { Checkbox, checkboxVariants } from "./index";

afterEach(cleanup);

describe("Checkbox", () => {
  it("toggles checked state via its label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <div>
        <Checkbox id="terms" onCheckedChange={onCheckedChange} />
        <Label htmlFor="terms">Accept terms</Label>
      </div>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox.getAttribute("data-state")).toBe("unchecked");

    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox.getAttribute("data-state")).toBe("checked");
  });

  it("merges className with the base variant classes", () => {
    render(<Checkbox className="custom-class" data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox.className).toContain("custom-class");
    expect(checkbox.className).toContain("rounded-sm");
    expect(checkboxVariants()).toContain("border-primary");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox data-testid="checkbox" disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByTestId("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
