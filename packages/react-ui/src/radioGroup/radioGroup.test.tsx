import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem, radioGroupItemVariants } from "./index";

afterEach(cleanup);

function renderRadioGroup(onValueChange?: (value: string) => void) {
  return render(
    <RadioGroup defaultValue="comfortable" onValueChange={onValueChange}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="radio-default" />
        <Label htmlFor="radio-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="radio-comfortable" />
        <Label htmlFor="radio-comfortable">Comfortable</Label>
      </div>
    </RadioGroup>,
  );
}

describe("RadioGroup", () => {
  it("renders a radiogroup with the default value selected", () => {
    renderRadioGroup();
    expect(screen.getByRole("radiogroup")).toBeTruthy();
    const selected = screen.getByRole("radio", { name: "Comfortable" });
    expect(selected.getAttribute("data-state")).toBe("checked");
    expect(screen.getByRole("radio", { name: "Default" }).getAttribute("data-state")).toBe(
      "unchecked",
    );
  });

  it("selects another option on click and reports the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderRadioGroup(onValueChange);

    await user.click(screen.getByRole("radio", { name: "Default" }));
    expect(onValueChange).toHaveBeenCalledWith("default");
    expect(screen.getByRole("radio", { name: "Default" }).getAttribute("data-state")).toBe(
      "checked",
    );
  });

  it("applies variant classes and merges className", () => {
    render(
      <RadioGroup className="custom-group" data-testid="group">
        <RadioGroupItem value="one" data-testid="item" className="custom-item" />
      </RadioGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group.className).toContain("grid");
    expect(group.className).toContain("custom-group");
    const item = screen.getByTestId("item");
    expect(item.className).toContain("rounded-full");
    expect(item.className).toContain("custom-item");
    expect(radioGroupItemVariants()).toContain("border-primary");
  });
});
