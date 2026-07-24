import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SidePanel, SidePanelDock, SidePanelDockProvider } from "./index";

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

  it("pins the footer below the scrollable body", () => {
    render(
      <SidePanel open title="Companion" footer={<button type="button">Save</button>}>
        <p>Body</p>
      </SidePanel>,
    );
    const footer = screen.getByText("Save").closest("footer");
    expect(footer).toBeTruthy();
    // Sibling of the scroll container, not inside it — it never scrolls away.
    expect(footer?.previousElementSibling?.textContent).toContain("Body");
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

describe("SidePanelDock", () => {
  function DockedPanels({ firstOpen, secondOpen }: { firstOpen: boolean; secondOpen: boolean }) {
    return (
      <SidePanelDockProvider>
        <SidePanelDock />
        {/* Panels can live anywhere under the provider — they portal in. */}
        <SidePanel open={firstOpen} title="First">
          <p>First body</p>
        </SidePanel>
        <SidePanel open={secondOpen} title="Second">
          <input aria-label="Second draft" defaultValue="kept" />
        </SidePanel>
      </SidePanelDockProvider>
    );
  }

  it("stacks every open panel inside the one dock container", () => {
    render(<DockedPanels firstOpen secondOpen />);
    const first = screen.getByRole("complementary", { name: "First" });
    const second = screen.getByRole("complementary", { name: "Second" });
    expect(first.parentElement).not.toBeNull();
    expect(first.parentElement).toBe(second.parentElement);
    expect(first.parentElement?.getAttribute("data-state")).toBe("open");
    // Stacked panels defer sizing/position to the dock column.
    expect(first.className).toContain("md:w-full");
    expect(first.className).not.toContain("md:w-[26rem]");
  });

  it("hides the dock while no panel is open, keeping closed panels mounted", () => {
    const { rerender } = render(<DockedPanels firstOpen secondOpen />);
    rerender(<DockedPanels firstOpen={false} secondOpen={false} />);
    const dock = document.querySelector('[data-state="closed"].contents');
    expect(dock).not.toBeNull();
    expect(dock?.className).toContain("md:hidden");
    // The draft survives inside the hidden dock.
    const input: HTMLInputElement = screen.getByLabelText("Second draft", { hidden: true });
    expect(input.value).toBe("kept");
    expect(screen.queryByRole("complementary", { name: "Second" })).toBeNull();
  });

  it("shares one width across stacked panels via the dock", async () => {
    const user = userEvent.setup();
    render(<DockedPanels firstOpen secondOpen />);
    const dock = screen.getByRole("complementary", { name: "First" }).parentElement;
    expect(dock?.className).toContain("md:w-[26rem]");
    // Widening from either panel resizes the shared column.
    await user.click(screen.getAllByRole("button", { name: "Widen panel" })[1]);
    expect(dock?.className).toContain("md:w-[34rem]");
    await user.click(screen.getAllByRole("button", { name: "Narrow panel" })[0]);
    expect(dock?.className).toContain("md:w-[26rem]");
  });

  it("keeps standalone behavior without a provider", () => {
    render(
      <SidePanel open title="Alone">
        <p>Body</p>
      </SidePanel>,
    );
    expect(screen.getByRole("complementary", { name: "Alone" }).className).toContain(
      "md:w-[26rem]",
    );
  });
});
