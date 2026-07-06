import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { HeaderBar } from "./index";

afterEach(cleanup);

describe("HeaderBar", () => {
  it("renders brand, nav, and actions inside a banner", () => {
    render(
      <HeaderBar
        brand={<span>Acme</span>}
        nav={<a href="#dashboard">Dashboard</a>}
        actions={<button type="button">Sign out</button>}
      />,
    );

    const banner = screen.getByRole("banner");
    expect(banner.textContent).toContain("Acme");
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
  });

  it("shows no mobile menu trigger without mobileNav", () => {
    render(<HeaderBar brand={<span>Acme</span>} />);
    expect(screen.queryByRole("button", { name: "Toggle menu" })).not.toBeTruthy();
  });

  it("opens the mobile nav sheet from the menu trigger", async () => {
    const user = userEvent.setup();
    render(<HeaderBar brand={<span>Acme</span>} mobileNav={<a href="#tasks">Tasks</a>} />);

    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Tasks");
  });
});
