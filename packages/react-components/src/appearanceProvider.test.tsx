import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppearanceProvider, useAppearance, type AppearancePreset } from "./appearanceProvider";

function Probe() {
  const { mode, toggleMode, preset, applyPreset, brand, layout, toggleLayout, density } =
    useAppearance();
  return (
    <div>
      <button type="button" onClick={toggleMode}>
        {mode}
      </button>
      <button type="button" onClick={() => applyPreset("emeraldCompact")}>
        {preset ?? "custom"}
      </button>
      <button type="button" onClick={toggleLayout}>
        {layout}
      </button>
      <output>{`${brand}/${density}`}</output>
    </div>
  );
}

const presets: readonly AppearancePreset[] = [
  { value: "bota", label: "Bota" },
  { value: "emeraldCompact", label: "Emerald compact", brand: "emerald", density: "compact" },
  { value: "violetTopnav", label: "Violet topnav", brand: "violet", layout: "topnav" },
];

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  delete document.documentElement.dataset.brand;
  delete document.documentElement.dataset.density;
  // The shared setup's matchMedia stub reports no preference; make it explicit.
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AppearanceProvider", () => {
  it("uses the stored appearance and applies the dark class and html attributes", () => {
    localStorage.setItem(
      "appearance",
      JSON.stringify({ mode: "dark", brand: "emerald", layout: "sidebar", density: "compact" }),
    );
    render(
      <AppearanceProvider presets={presets}>
        <Probe />
      </AppearanceProvider>,
    );
    expect(screen.getByRole("button", { name: "dark" })).toBeTruthy();
    // The stored axes match the emeraldCompact preset, so it reports as active.
    expect(screen.getByRole("button", { name: "emeraldCompact" })).toBeTruthy();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.brand).toBe("emerald");
    expect(document.documentElement.dataset.density).toBe("compact");
  });

  it("starts from the defaultPreset when nothing is stored", () => {
    render(
      <AppearanceProvider presets={presets} defaultPreset="violetTopnav">
        <Probe />
      </AppearanceProvider>,
    );
    expect(screen.getByRole("button", { name: "violetTopnav" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "topnav" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("violet/comfortable");
  });

  it("applies every axis of a preset in one call, preserving the mode", () => {
    render(
      <AppearanceProvider presets={presets} defaultMode="dark">
        <Probe />
      </AppearanceProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "bota" }).click();
    });
    expect(screen.getByRole("button", { name: "emeraldCompact" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "dark" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("emerald/compact");
    expect(JSON.parse(localStorage.getItem("appearance") ?? "null")).toEqual({
      mode: "dark",
      brand: "emerald",
      layout: "sidebar",
      density: "compact",
    });
  });

  it("reports a custom mix when a granular toggle moves off every preset", () => {
    render(
      <AppearanceProvider presets={presets}>
        <Probe />
      </AppearanceProvider>,
    );
    expect(screen.getByRole("button", { name: "bota" })).toBeTruthy();
    act(() => {
      screen.getByRole("button", { name: "sidebar" }).click();
    });
    // bota + topnav matches no preset (violetTopnav has the violet brand).
    expect(screen.getByRole("button", { name: "custom" })).toBeTruthy();
  });

  it("drops stored axes the app no longer offers instead of trusting them wholesale", () => {
    localStorage.setItem(
      "appearance",
      JSON.stringify({ mode: "dark", brand: "retired", layout: "carousel", density: "dense" }),
    );
    render(
      <AppearanceProvider presets={presets}>
        <Probe />
      </AppearanceProvider>,
    );
    expect(screen.getByRole("button", { name: "dark" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "sidebar" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("bota/comfortable");
  });

  it("throws on a defaultPreset that is not in the presets list", () => {
    expect(() =>
      render(
        <AppearanceProvider presets={presets} defaultPreset="retired">
          <Probe />
        </AppearanceProvider>,
      ),
    ).toThrow(/defaultPreset "retired"/);
  });

  it("persists under a custom storageKey", () => {
    render(
      <AppearanceProvider presets={presets} storageKey="my-app-appearance">
        <Probe />
      </AppearanceProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "light" }).click();
    });
    expect(JSON.parse(localStorage.getItem("my-app-appearance") ?? "null")).toMatchObject({
      mode: "dark",
    });
    expect(localStorage.getItem("appearance")).toBeNull();
  });

  it("survives localStorage throwing (privacy mode)", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(
      <AppearanceProvider>
        <Probe />
      </AppearanceProvider>,
    );
    expect(screen.getByRole("button", { name: "light" })).toBeTruthy();
    getItem.mockRestore();
  });
});
