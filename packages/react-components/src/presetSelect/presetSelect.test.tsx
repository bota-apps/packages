import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppearanceProvider, useAppearance, type AppearancePreset } from "../appearanceProvider";
import { PresetSelect } from "./index";

const presets: readonly AppearancePreset[] = [
  { value: "bota", label: "Bota" },
  { value: "emeraldCompact", label: "Emerald compact", brand: "emerald", density: "compact" },
];

function AxesProbe() {
  const { brand, layout, density } = useAppearance();
  return <output>{`${brand}/${layout}/${density}`}</output>;
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.brand;
  delete document.documentElement.dataset.density;
});

afterEach(cleanup);

describe("PresetSelect", () => {
  it("applies every axis of the picked preset in one selection", async () => {
    render(
      <AppearanceProvider presets={presets}>
        <PresetSelect />
        <AxesProbe />
      </AppearanceProvider>,
    );
    expect(screen.getByRole("status").textContent).toBe("bota/sidebar/comfortable");

    await userEvent.click(screen.getByRole("button", { name: "Change theme" }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: "Emerald compact" }));

    expect(screen.getByRole("status").textContent).toBe("emerald/sidebar/compact");
    expect(document.documentElement.dataset.brand).toBe("emerald");
    expect(document.documentElement.dataset.density).toBe("compact");
  });

  it("renders nothing for single-preset apps", () => {
    render(
      <AppearanceProvider>
        <PresetSelect />
      </AppearanceProvider>,
    );

    expect(screen.queryByRole("button", { name: "Change theme" })).toBeNull();
  });
});
