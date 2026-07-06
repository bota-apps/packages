import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppearanceProvider, useAppearance } from "../appearanceProvider";
import { LayoutToggle } from "./index";

function LayoutProbe() {
  const { layout } = useAppearance();
  return <output>{layout}</output>;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(cleanup);

describe("LayoutToggle", () => {
  it("flips the shell layout through the appearance provider", async () => {
    render(
      <AppearanceProvider>
        <LayoutToggle />
        <LayoutProbe />
      </AppearanceProvider>,
    );

    const button = screen.getByRole("button", { name: "Switch layout" });
    expect(screen.getByRole("status").textContent).toBe("sidebar");

    await userEvent.click(button);
    expect(screen.getByRole("status").textContent).toBe("topnav");

    await userEvent.click(button);
    expect(screen.getByRole("status").textContent).toBe("sidebar");
  });
});
