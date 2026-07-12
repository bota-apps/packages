import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPalette,
  CommandShortcut,
} from "./index";

function paletteContent() {
  return (
    <>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem>
            Go to dashboard
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem>Open settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

describe("CommandPalette", () => {
  it("renders input and items inside an accessible dialog", () => {
    render(
      <CommandPalette open onOpenChange={vi.fn()}>
        {paletteContent()}
      </CommandPalette>,
    );
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeTruthy();
    expect(screen.getByPlaceholderText("Type a command or search…")).toBeTruthy();
    expect(screen.getByText("Go to dashboard")).toBeTruthy();
    expect(screen.getByText("Open settings")).toBeTruthy();
  });

  it("filters items as the user types and shows the empty state on no match", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette open onOpenChange={vi.fn()}>
        {paletteContent()}
      </CommandPalette>,
    );
    await user.type(screen.getByPlaceholderText("Type a command or search…"), "dash");
    expect(screen.getByText("Go to dashboard")).toBeTruthy();
    expect(screen.queryByText("Open settings")).toBeNull();

    await user.clear(screen.getByPlaceholderText("Type a command or search…"));
    await user.type(
      screen.getByPlaceholderText("Type a command or search…"),
      "zzz-no-such-command",
    );
    expect(screen.getByText("No results found.")).toBeTruthy();
  });

  it("highlights rows with the muted transient surface, not the selected tokens", () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Only item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    const item = screen.getByText("Only item");
    expect(item.className).toContain("data-[selected=true]:bg-muted");
    expect(item.className).not.toContain("bg-selected");
  });
});
