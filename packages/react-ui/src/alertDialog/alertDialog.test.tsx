import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./index";

function renderAlertDialog() {
  return render(
    <AlertDialog>
      <AlertDialogTrigger>Delete account</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  );
}

afterEach(cleanup);

describe("AlertDialog", () => {
  it("opens from the trigger with alertdialog semantics", async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    expect(screen.queryByRole("alertdialog")).not.toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Are you absolutely sure?");
    expect(dialog.textContent).toContain("This action cannot be undone.");
  });

  it("applies the content variant classes", async () => {
    const user = userEvent.setup();
    renderAlertDialog();
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog.className).toContain("max-w-lg");
    expect(dialog.className).toContain("bg-popover");
  });

  it("closes via the cancel button", async () => {
    const user = userEvent.setup();
    renderAlertDialog();
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    expect(screen.getByRole("alertdialog")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeTruthy());
  });
});
