import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("opens the nav in a sheet from the mobile menu button and closes it on link click", async () => {
    const user = userEvent.setup();
    render(
      <AppShellLayout brand={<span>Bota Console</span>} nav={<a href="#home">Home</a>}>
        <p>Page content</p>
      </AppShellLayout>,
    );

    // Closed by default: only the rail's nav is in the document.
    expect(screen.getAllByRole("navigation")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const sheet = screen.getByRole("dialog");
    expect(within(sheet).getByRole("navigation").textContent).toContain("Home");

    // Navigating closes the sheet again.
    await user.click(within(sheet).getByText("Home"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("gives the contextual header text a shrinkable, truncation-safe host", () => {
    render(
      <AppShellLayout
        brand={<span>Bota Console</span>}
        nav={<a href="#home">Home</a>}
        headerLeft={<span>Signed in as Jane</span>}
      >
        <p>Page content</p>
      </AppShellLayout>,
    );

    const host = screen.getByText("Signed in as Jane").parentElement;
    expect(host?.className).toContain("min-w-0");
    expect(host?.className).toContain("flex-1");
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

  it.each(["sidebar", "topnav"] as const)(
    "docks the panel slot beside the content well (%s layout)",
    (layout) => {
      render(
        <AppShellLayout
          layout={layout}
          brand={<span>Bota Console</span>}
          nav={<a href="#home">Home</a>}
          panel={<aside aria-label="Companion">Panel content</aside>}
        >
          <p>Page content</p>
        </AppShellLayout>,
      );

      const main = screen.getByRole("main");
      const panel = screen.getByRole("complementary", { name: "Companion" });
      // Siblings in the same content row — pushed aside, not overlaid, and
      // below the header rather than covering it.
      expect(panel.parentElement).toBe(main.parentElement);
      expect(main.parentElement?.className).toContain("flex");
      expect(screen.getByRole("banner").contains(panel)).toBe(false);
    },
  );
});
