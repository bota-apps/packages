import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppShellLayout } from "./index";

afterEach(cleanup);

describe("AppShellLayout", () => {
  it("renders brand, nav, header slots, and children in their landmarks", () => {
    render(
      <AppShellLayout
        brand={<span>Bota Console</span>}
        nav={<a href="#home">Home</a>}
        headerLeft={<span>Signed in as Jane</span>}
        headerRight={<button type="button">Sign out</button>}
      >
        <p>Page content</p>
      </AppShellLayout>,
    );

    expect(screen.getByText("Bota Console")).toBeTruthy();
    expect(screen.getByRole("navigation").textContent).toContain("Home");
    const header = screen.getByRole("banner");
    expect(header.textContent).toContain("Signed in as Jane");
    expect(header.textContent).toContain("Sign out");
    expect(screen.getByRole("main").textContent).toContain("Page content");
  });

  it("renders without the optional header slots", () => {
    render(
      <AppShellLayout brand={<span>Bota Console</span>} nav={<span>nav</span>}>
        <p>Page content</p>
      </AppShellLayout>,
    );

    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("main").textContent).toContain("Page content");
  });

  it("renders the same slots in the top bar for the topnav layout", () => {
    render(
      <AppShellLayout
        layout="topnav"
        brand={<span>Bota Console</span>}
        nav={<a href="#home">Home</a>}
        headerLeft={<span>Signed in as Jane</span>}
        headerRight={<button type="button">Sign out</button>}
      >
        <p>Page content</p>
      </AppShellLayout>,
    );

    // No sidebar: brand, nav, and both header slots live in the banner.
    expect(screen.queryByRole("complementary")).toBeNull();
    const header = screen.getByRole("banner");
    expect(header.textContent).toContain("Bota Console");
    expect(header.textContent).toContain("Signed in as Jane");
    expect(header.textContent).toContain("Sign out");
    expect(screen.getByRole("navigation").textContent).toContain("Home");
    expect(screen.getByRole("main").textContent).toContain("Page content");
  });
});
