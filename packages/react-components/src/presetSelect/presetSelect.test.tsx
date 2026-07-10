import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IceCreamCone } from "lucide-react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppearanceProvider, useAppearance, type AppearancePreset } from "../appearanceProvider";
import { PresetSelect } from "./index";

const presets: readonly AppearancePreset[] = [
  { value: "bota", label: "Bota" },
  {
    value: "sorbet",
    label: "Sorbet",
    icon: IceCreamCone,
    description: "Soft rounded corners, berry brights",
    brand: "sorbet",
    density: "compact",
  },
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
    await userEvent.click(await screen.findByRole("menuitemradio", { name: /Sorbet/ }));

    expect(screen.getByRole("status").textContent).toBe("sorbet/sidebar/compact");
    expect(document.documentElement.dataset.brand).toBe("sorbet");
    expect(document.documentElement.dataset.density).toBe("compact");
  });

  it("shows each preset's icon and one-line description", async () => {
    render(
      <AppearanceProvider presets={presets}>
        <PresetSelect />
      </AppearanceProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Change theme" }));
    const item = await screen.findByRole("menuitemradio", { name: /Sorbet/ });
    expect(item.textContent).toContain("Soft rounded corners, berry brights");
    expect(item.querySelector("svg")).toBeTruthy();
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
