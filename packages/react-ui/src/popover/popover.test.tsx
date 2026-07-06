import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Popover, PopoverContent, PopoverTrigger } from "./index";

describe("Popover", () => {
  it("opens from the trigger and shows content", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Dimensions</PopoverTrigger>
        <PopoverContent>Set the dimensions for the layer.</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText("Set the dimensions for the layer.")).not.toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Dimensions" }));
    expect(screen.getByText("Set the dimensions for the layer.")).toBeTruthy();
  });

  it("applies the content variant classes and merges className", () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="w-72">Popover body</PopoverContent>
      </Popover>,
    );

    const content = screen.getByText("Popover body");
    expect(content.className).toContain("bg-popover");
    expect(content.className).toContain("rounded-md");
    expect(content.className).toContain("w-72");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Popover body")).toBeTruthy();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Popover body")).not.toBeTruthy());
  });
});
