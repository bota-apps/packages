import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Plus } from "lucide-react";
import { FAB, buttonVariants } from "./index";

afterEach(cleanup);

describe("FAB", () => {
  it("renders a floating action button fixed to the bottom-right by default", () => {
    render(
      <FAB aria-label="Create new">
        <Plus />
      </FAB>,
    );

    const button = screen.getByRole("button", { name: "Create new" });
    expect(button.className).toContain("rounded-full");
    expect(button.className).toContain("fixed");
    expect(button.className).toContain("right-8");
  });

  it("supports the bottom-left position", () => {
    render(
      <FAB aria-label="Edit" position="bottom-left">
        <Plus />
      </FAB>,
    );

    const button = screen.getByRole("button", { name: "Edit" });
    expect(button.className).toContain("left-8");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <FAB aria-label="Create new" onClick={onClick}>
        <Plus />
      </FAB>,
    );

    await user.click(screen.getByRole("button", { name: "Create new" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("re-exports the button CVA that provides the fab styling", () => {
    expect(buttonVariants({ variant: "fab", size: "fab" })).toContain("rounded-full");
  });
});
