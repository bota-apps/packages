import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SidePanel } from "./index";

describe("SidePanel", () => {
  it("renders an accessible complementary region with title and description", () => {
    render(
      <SidePanel open title="Companion" description="Stays beside the content">
        <p>Panel body</p>
      </SidePanel>,
    );
    const region = screen.getByRole("complementary", { name: "Companion" });
    expect(region.getAttribute("data-state")).toBe("open");
    expect(screen.getByText("Stays beside the content")).toBeTruthy();
    expect(screen.getByText("Panel body")).toBeTruthy();
  });

  it("keeps children mounted while closed, so drafts survive close/reopen", () => {
    const { rerender } = render(
      <SidePanel open title="Companion">
        <input aria-label="Draft" defaultValue="typed text" />
      </SidePanel>,
    );
    rerender(
      <SidePanel open={false} title="Companion">
        <input aria-label="Draft" defaultValue="typed text" />
      </SidePanel>,
    );
    // Hidden but still in the DOM with its state intact.
    const input: HTMLInputElement = screen.getByLabelText("Draft", { hidden: true });
    expect(input.value).toBe("typed text");
    // Fully out of the accessibility tree and tab order while closed — the
    // region must not shadow the page's own controls in role queries or for
    // assistive tech.
    expect(screen.queryByRole("complementary", { name: "Companion" })).toBeNull();
    const region = document.querySelector('[data-state="closed"]');
    expect(region?.hasAttribute("hidden")).toBe(true);
    expect(region?.getAttribute("aria-hidden")).toBe("true");
    expect(region?.hasAttribute("inert")).toBe(true);
  });

  it("closes via the close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <SidePanel open title="Companion" onOpenChange={onOpenChange}>
        <p>Body</p>
      </SidePanel>,
    );
    await user.click(screen.getByRole("button", { name: "Close panel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("steps through the width presets and disables the controls at the ends", async () => {
    const user = userEvent.setup();
    render(
      <SidePanel open title="Companion">
        <p>Body</p>
      </SidePanel>,
    );
    const region = screen.getByRole("complementary", { name: "Companion" });
    const widen = screen.getByRole("button", { name: "Widen panel" });
    const narrow: HTMLButtonElement = screen.getByRole("button", { name: "Narrow panel" });

    // Starts at the narrowest preset — narrowing further is disabled.
    expect(region.className).toContain("md:w-[26rem]");
    expect(narrow.disabled).toBe(true);

    await user.click(widen);
    expect(region.className).toContain("md:w-[34rem]");
    await user.click(widen);
    expect(region.className).toContain("md:w-[42rem]");
    expect((widen as HTMLButtonElement).disabled).toBe(true);
    expect(narrow.disabled).toBe(false);
  });

  it("supports a controlled width", async () => {
    const user = userEvent.setup();
    const onWidthChange = vi.fn();
    render(
      <SidePanel open title="Companion" width="lg" onWidthChange={onWidthChange}>
        <p>Body</p>
      </SidePanel>,
    );
    expect(screen.getByRole("complementary", { name: "Companion" }).className).toContain(
      "md:w-[34rem]",
    );
    await user.click(screen.getByRole("button", { name: "Widen panel" }));
    expect(onWidthChange).toHaveBeenCalledWith("xl");
  });

  it("can hide the width controls", () => {
    render(
      <SidePanel open title="Companion" widthControls={false}>
        <p>Body</p>
      </SidePanel>,
    );
    expect(screen.queryByRole("button", { name: "Widen panel" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Narrow panel" })).toBeNull();
  });
});
