import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./index";

const fruits: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", description: "Rich in potassium" },
  { value: "cherry", label: "Cherry" },
];

describe("Combobox", () => {
  it("opens the listbox from the trigger and shows all options", async () => {
    const user = userEvent.setup();
    render(<Combobox options={fruits} placeholder="Select a fruit" />);

    const trigger = screen.getByRole("combobox");
    expect(trigger.textContent).toContain("Select a fruit");
    expect(screen.queryAllByRole("option")).toHaveLength(0);

    await user.click(trigger);

    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(3));
    expect(screen.getByText("Apple")).toBeTruthy();
    expect(screen.getByText("Banana")).toBeTruthy();
    expect(screen.getByText("Rich in potassium")).toBeTruthy();
  });

  it("filters options via the search input", async () => {
    const user = userEvent.setup();
    render(<Combobox options={fruits} />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("ban");

    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(1));
    expect(screen.getByText("Banana")).toBeTruthy();
  });

  it("selects an option and reports it through onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={fruits} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Cherry"));

    expect(onValueChange).toHaveBeenCalledWith("cherry");
    // Listbox closes after selection.
    await waitFor(() => expect(screen.queryAllByRole("option")).toHaveLength(0));
  });

  it("shows the selected option label on the trigger", async () => {
    render(<Combobox options={fruits} value="banana" />);
    expect(screen.getByRole("combobox").textContent).toContain("Banana");
  });
});
