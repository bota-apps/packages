import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PageMenuActions, pageMenuActionItemVariants, type PageMenuAction } from "./index";

afterEach(cleanup);

describe("PageMenuActions", () => {
  it("renders nothing when all actions are hidden", () => {
    const actions: PageMenuAction[] = [{ label: "Edit", hidden: true }];
    const { container } = render(<PageMenuActions actions={actions} />);
    expect(container.firstChild).toBe(null);
  });

  it("opens the menu from the trigger and invokes the selected action", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const actions: PageMenuAction[] = [
      { label: "Edit", onClick: onEdit },
      { label: "Duplicate", disabled: true },
      { label: "Secret", hidden: true },
    ];
    render(<PageMenuActions actions={actions} />);

    await user.click(screen.getByRole("button"));
    const menu = await screen.findByRole("menu");
    expect(menu).toBeTruthy();
    expect(screen.queryByText("Secret")).toBe(null);
    expect(
      screen.getByRole("menuitem", { name: "Duplicate" }).getAttribute("data-disabled"),
    ).not.toBe(null);

    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    await waitFor(() => expect(onEdit).toHaveBeenCalledTimes(1));
  });

  it("styles destructive actions and separates them from default actions", async () => {
    const user = userEvent.setup();
    const actions: PageMenuAction[] = [
      { label: "Edit" },
      { label: "Delete", variant: "destructive" },
    ];
    render(<PageMenuActions actions={actions} />);

    await user.click(screen.getByRole("button"));
    const deleteItem = await screen.findByRole("menuitem", { name: "Delete" });
    expect(deleteItem.className).toContain("text-destructive");
    expect(screen.getByRole("separator")).toBeTruthy();
    expect(pageMenuActionItemVariants({ variant: "destructive" })).toContain("text-destructive");
    expect(pageMenuActionItemVariants({ variant: "default" })).toBe("");
  });

  it("renders nested actions in a submenu", async () => {
    const user = userEvent.setup();
    const onExportPdf = vi.fn();
    const actions: PageMenuAction[] = [
      {
        label: "Export",
        children: [{ label: "PDF", onClick: onExportPdf }, { label: "CSV" }],
      },
    ];
    render(<PageMenuActions actions={actions} />);

    await user.click(screen.getByRole("button"));
    await screen.findByRole("menuitem", { name: "Export" });
    // Submenus open via keyboard navigation: highlight the trigger, then ArrowRight.
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "PDF" });
    expect(screen.getByRole("menuitem", { name: "CSV" })).toBeTruthy();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(onExportPdf).toHaveBeenCalledTimes(1));
  });
});
