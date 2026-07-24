import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppearanceProvider, type AppearancePreset } from "../appearanceProvider";
import { AppearancePanel } from "./index";

const presets: readonly AppearancePreset[] = [
  {
    value: "bota",
    label: "Bota",
    description: "The signature look",
    preview: ["#2563EB", "#0B7F7E"],
  },
  { value: "ember", label: "Ember", brand: "ember", preview: ["#FF6A00"] },
];

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("style");
  delete document.documentElement.dataset.brand;
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderPanel() {
  return render(
    <AppearanceProvider presets={presets}>
      <AppearancePanel open />
    </AppearanceProvider>,
  );
}

describe("AppearancePanel", () => {
  it("lists the presets as a radio group with swatches and applies a pick", async () => {
    const user = userEvent.setup();
    renderPanel();
    const active = screen.getByRole("radio", { name: /Bota/ });
    expect(active.getAttribute("aria-checked")).toBe("true");
    // The preview colors render as swatch hints.
    expect(active.querySelectorAll("[style]").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("radio", { name: "Ember" }));
    expect(document.documentElement.dataset.brand).toBe("ember");
    expect(screen.getByRole("radio", { name: "Ember" }).getAttribute("aria-checked")).toBe("true");
  });

  it("switches light and dark mode", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole("button", { name: "Dark" }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    // Re-clicking the active mode is a no-op, not a toggle.
    await user.click(screen.getByRole("button", { name: "Dark" }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Light" }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("drives the custom color from the picker and resets it", () => {
    renderPanel();
    const picker: HTMLInputElement = screen.getByLabelText("Pick a custom color");
    // userEvent has no color-input support; fire the change directly.
    fireEvent.change(picker, { target: { value: "#ff6a00" } });
    expect(document.documentElement.style.getPropertyValue("--primary")).not.toBe("");
    expect(screen.getByText("#ff6a00")).toBeTruthy();
    act(() => {
      screen.getByRole("button", { name: /Reset to theme colors/ }).click();
    });
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("");
    expect(screen.queryByRole("button", { name: /Reset to theme colors/ })).toBeNull();
  });
});
