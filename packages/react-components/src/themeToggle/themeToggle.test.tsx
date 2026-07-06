import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AppearanceProvider } from "../appearanceProvider";
import { ThemeToggle } from "./index";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeToggle", () => {
  it("toggles the dark class through the appearance provider", async () => {
    render(
      <AppearanceProvider>
        <ThemeToggle />
      </AppearanceProvider>,
    );

    const button = screen.getByRole("button", { name: "Toggle theme" });
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await userEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await userEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
