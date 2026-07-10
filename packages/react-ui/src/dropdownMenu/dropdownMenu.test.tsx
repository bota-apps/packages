import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./index";

function renderMenu(props: { defaultOpen?: boolean } = {}) {
  return render(
    <DropdownMenu {...props}>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Row actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem inset>Duplicate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
}

describe("DropdownMenu", () => {
  it("opens from the trigger with menu semantics", async () => {
    const user = userEvent.setup();
    renderMenu();

    expect(screen.queryByRole("menu")).not.toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toBeTruthy();
  });

  it("applies content and item variant classes, including inset", () => {
    renderMenu({ defaultOpen: true });

    const menu = screen.getByRole("menu");
    expect(menu.className).toContain("bg-popover");
    expect(menu.className).toContain("min-w-[8rem]");

    const item = screen.getByRole("menuitem", { name: "Edit" });
    expect(item.className).toContain("focus:bg-muted");
    expect(item.className).not.toContain("pl-8");

    const insetItem = screen.getByRole("menuitem", { name: "Duplicate" });
    expect(insetItem.className).toContain("pl-8");
  });

  it("selects an item and closes the menu", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onSelect).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeTruthy());
  });
});
