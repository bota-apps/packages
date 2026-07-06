import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./index";

function renderDialog(props: { closeLabel?: string } = {}) {
  return render(
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent {...props}>
        <DialogTitle>Confirm action</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
        <button type="button">Do it</button>
      </DialogContent>
    </Dialog>,
  );
}

afterEach(cleanup);

describe("Dialog", () => {
  it("opens from the trigger with correct dialog semantics", async () => {
    const user = userEvent.setup();
    renderDialog();

    expect(screen.queryByRole("dialog")).not.toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = screen.getByRole("dialog");
    // Radix conveys modality by aria-hiding everything outside the dialog.
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Open dialog", hidden: false })).not.toBeTruthy(),
    );
    // Title and description are wired up via aria-labelledby / aria-describedby.
    const labelledBy = dialog.getAttribute("aria-labelledby");
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(labelledBy).toBeTruthy();
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)?.textContent).toBe("Confirm action");
    expect(document.getElementById(describedBy!)?.textContent).toBe("This cannot be undone.");
  });

  it("traps focus inside the open dialog", async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
    // Tabbing cycles within the dialog, never back to the trigger.
    for (let i = 0; i < 5; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    renderDialog();
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeTruthy();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeTruthy());
    expect(document.activeElement).toBe(trigger);
  });

  it("closes via the built-in close button and supports closeLabel", async () => {
    const user = userEvent.setup();
    renderDialog({ closeLabel: "Schließen" });
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    await user.click(screen.getByRole("button", { name: "Schließen" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeTruthy());
  });

  it("supports controlled open/onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Controlled</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    // Parent decides: stays open until the controlled prop changes.
    expect(screen.getByRole("dialog")).toBeTruthy();

    rerender(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Controlled</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeTruthy());
  });

  it("forwards asChild trigger props without clobbering the caller's onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button type="button" onClick={onClick}>
            Custom trigger
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Custom trigger" }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});
