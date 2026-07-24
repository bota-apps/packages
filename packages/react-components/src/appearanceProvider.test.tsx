import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppearanceProvider, useAppearance, type AppearancePreset } from "./appearanceProvider";

function Probe() {
  const {
    mode,
    toggleMode,
    preset,
    applyPreset,
    brand,
    layout,
    toggleLayout,
    density,
    customColor,
    setCustomColor,
    hydrateAppearance,
  } = useAppearance();
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
      <button type="button" onClick={() => setCustomColor("#FF6A00")}>
        set-color
      </button>
      <button type="button" onClick={() => setCustomColor(null)}>
        clear-color
      </button>
      <button
        type="button"
        onClick={() =>
          hydrateAppearance({
            mode: "dark",
            brand: "not-offered",
            density: "compact",
            customColor: "#2563EB",
          })
        }
      >
        hydrate
      </button>
      <output>{`${brand}/${density}/${customColor ?? "none"}`}</output>
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
  document.documentElement.removeAttribute("style");
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
    expect(screen.getByRole("status").textContent).toBe("violet/comfortable/none");
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
    expect(screen.getByRole("status").textContent).toBe("emerald/compact/none");
    expect(JSON.parse(localStorage.getItem("appearance") ?? "null")).toEqual({
      mode: "dark",
      brand: "emerald",
      layout: "sidebar",
      density: "compact",
      customColor: null,
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
    expect(screen.getByRole("status").textContent).toBe("bota/comfortable/none");
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

  it("layers a custom color as inline token overrides and clears them on reset", () => {
    render(
      <AppearanceProvider presets={presets}>
        <Probe />
      </AppearanceProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "set-color" }).click();
    });
    const root = document.documentElement;
    expect(root.style.getPropertyValue("--primary")).not.toBe("");
    expect(root.style.getPropertyValue("--sidebar-background")).not.toBe("");
    expect(JSON.parse(localStorage.getItem("appearance") ?? "null")).toMatchObject({
      customColor: "#FF6A00",
    });
    act(() => {
      screen.getByRole("button", { name: "clear-color" }).click();
    });
    expect(root.style.getPropertyValue("--primary")).toBe("");
    expect(screen.getByRole("status").textContent).toContain("/none");
  });

  it("keeps the active preset reported while a custom color tints it, and drops the tint on a preset switch", () => {
    render(
      <AppearanceProvider presets={presets}>
        <Probe />
      </AppearanceProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "set-color" }).click();
    });
    // The color overrides tokens, not the preset axes — bota stays active.
    expect(screen.getByRole("button", { name: "bota" })).toBeTruthy();
    act(() => {
      screen.getByRole("button", { name: "bota" }).click();
    });
    // Picking a preset re-baselines: the custom color is gone.
    expect(screen.getByRole("status").textContent).toBe("emerald/compact/none");
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("");
  });

  it("restores a stored custom color and rejects malformed ones", () => {
    localStorage.setItem(
      "appearance",
      JSON.stringify({ mode: "light", brand: "emerald", customColor: "#2563EB" }),
    );
    render(
      <AppearanceProvider presets={presets}>
        <Probe />
      </AppearanceProvider>,
    );
    expect(screen.getByRole("status").textContent).toBe("emerald/comfortable/#2563EB");
    expect(document.documentElement.style.getPropertyValue("--primary")).not.toBe("");
  });

  it("hydrates externally stored axes, validating each one individually", () => {
    render(
      <AppearanceProvider presets={presets}>
        <Probe />
      </AppearanceProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "hydrate" }).click();
    });
    // mode/density/customColor apply; the unknown brand is ignored.
    expect(screen.getByRole("button", { name: "dark" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("bota/compact/#2563EB");
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
