import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./index";

function renderContextMenu() {
  return render(
    <ContextMenu>
      <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel inset>File</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
  );
}

describe("ContextMenu", () => {
  it("opens on right-click with menu semantics", async () => {
    renderContextMenu();

    expect(screen.queryByRole("menu")).not.toBeTruthy();
    fireEvent.contextMenu(screen.getByText("Right-click here"));

    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    expect(screen.getByRole("menuitem", { name: "Open" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Rename" })).toBeTruthy();
  });

  it("applies content, item, and inset label variant classes", async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText("Right-click here"));
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());

    const menu = screen.getByRole("menu");
    expect(menu.className).toContain("bg-popover");
    expect(menu.className).toContain("min-w-[8rem]");

    const item = screen.getByRole("menuitem", { name: "Open" });
    expect(item.className).toContain("focus:bg-accent");

    const label = screen.getByText("File");
    expect(label.className).toContain("pl-8");
  });

  it("closes on Escape", async () => {
    renderContextMenu();
    fireEvent.contextMenu(screen.getByText("Right-click here"));
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());

    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeTruthy());
  });
});
