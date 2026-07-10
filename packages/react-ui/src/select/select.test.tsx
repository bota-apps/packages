import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
} from "./index";

function renderSelect(props: { width?: "full" | "auto" } = {}) {
  return render(
    <Select>
      <SelectTrigger data-testid="trigger" {...props}>
        <SelectValue placeholder="Pick a currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="CHF">Swiss Franc</SelectItem>
        <SelectItem value="USD">US Dollar</SelectItem>
      </SelectContent>
    </Select>,
  );
}

describe("Select", () => {
  it("opens from the trigger and selects an option", async () => {
    const user = userEvent.setup();
    renderSelect();

    const trigger = screen.getByTestId("trigger");
    expect(trigger.textContent).toContain("Pick a currency");

    await user.click(trigger);
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeTruthy();

    await user.click(screen.getByRole("option", { name: "US Dollar" }));
    expect(screen.queryByRole("listbox")).not.toBeTruthy();
    expect(trigger.textContent).toContain("US Dollar");
  });

  it("applies width variant classes on the trigger", () => {
    renderSelect({ width: "auto" });
    const trigger = screen.getByTestId("trigger");
    expect(trigger.className).toContain("min-w-[12rem]");
    expect(selectTriggerVariants({ width: "full" })).toContain("w-full");
    expect(trigger.className).not.toContain("w-full");
  });
});
