import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Label } from "../label";
import { Switch, switchVariants } from "./index";

afterEach(cleanup);

describe("Switch", () => {
  it("toggles on and off via its label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <div>
        <Switch id="notify" onCheckedChange={onCheckedChange} />
        <Label htmlFor="notify">Notifications</Label>
      </div>,
    );

    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle.getAttribute("data-state")).toBe("unchecked");

    await user.click(toggle);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle.getAttribute("data-state")).toBe("checked");

    await user.click(toggle);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(toggle.getAttribute("data-state")).toBe("unchecked");
  });

  it("merges className with the base variant classes", () => {
    render(<Switch className="custom-class" data-testid="switch" />);
    const toggle = screen.getByTestId("switch");
    expect(toggle.className).toContain("custom-class");
    expect(toggle.className).toContain("rounded-full");
    expect(switchVariants()).toContain("data-[state=checked]:bg-primary");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch data-testid="switch" disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByTestId("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
