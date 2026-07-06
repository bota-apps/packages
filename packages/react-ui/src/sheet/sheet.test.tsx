import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Sheet, SheetContent, SheetTrigger } from "./index";
import { sheetVariants } from "./variants";

afterEach(cleanup);

describe("Sheet", () => {
  it("opens from the trigger and renders title and description", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent title="Filters" description="Refine the current list.">
          <p>Sheet body content.</p>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.queryByRole("dialog")).not.toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Open sheet" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Filters");
    expect(dialog.textContent).toContain("Refine the current list.");
    expect(dialog.textContent).toContain("Sheet body content.");
  });

  it("applies side and padding variant classes", () => {
    render(
      <Sheet open>
        <SheetContent side="left" padding="none" title="Navigation" />
      </Sheet>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("left-0");
    expect(dialog.className).toContain("border-r");
    expect(dialog.className).toContain("p-0");
  });

  it("defaults to the right side with default padding", () => {
    expect(sheetVariants()).toContain("right-0");
    expect(sheetVariants()).toContain("p-6");
  });

  it("closes via the built-in close button and supports closeLabel", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent title="Filters" closeLabel="Schließen" />
      </Sheet>,
    );

    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await user.click(screen.getByRole("button", { name: "Schließen" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeTruthy());
  });
});
