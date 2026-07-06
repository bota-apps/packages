import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "./index";

afterEach(cleanup);

describe("ConfirmDialog", () => {
  it("opens from the trigger and calls onConfirm", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        trigger={<button type="button">Delete item</button>}
        title="Delete item?"
        description="This action cannot be undone."
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete item" }));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Delete item?");
    expect(dialog.textContent).toContain("This action cannot be undone.");

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeTruthy());
  });

  it("closes via cancel without confirming", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        trigger={<button type="button">Archive</button>}
        title="Archive?"
        description="You can restore it later."
        cancelLabel="Keep it"
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Archive" }));
    await user.click(screen.getByRole("button", { name: "Keep it" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeTruthy());
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("applies destructive button styling for the destructive variant", () => {
    render(
      <ConfirmDialog
        open
        title="Delete item?"
        description="This action cannot be undone."
        variant="destructive"
        onConfirm={() => {}}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    expect(confirmButton.className).toContain("bg-destructive");
  });

  it("disables both buttons and ignores clicks while confirming", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Archiving…"
        description="In flight."
        confirming
        onConfirm={onConfirm}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(confirmButton.hasAttribute("disabled")).toBe(true);
    expect(cancelButton.hasAttribute("disabled")).toBe(true);

    await user.click(confirmButton);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
