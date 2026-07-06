import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppearanceProvider } from "../appearanceProvider";
import { DensityToggle } from "./index";

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.density;
});

afterEach(cleanup);

describe("DensityToggle", () => {
  it("flips the html data-density attribute through the appearance provider", async () => {
    render(
      <AppearanceProvider>
        <DensityToggle />
      </AppearanceProvider>,
    );

    const button = screen.getByRole("button", { name: "Switch density" });
    expect(document.documentElement.dataset.density).toBe("comfortable");

    await userEvent.click(button);
    expect(document.documentElement.dataset.density).toBe("compact");

    await userEvent.click(button);
    expect(document.documentElement.dataset.density).toBe("comfortable");
  });
});
