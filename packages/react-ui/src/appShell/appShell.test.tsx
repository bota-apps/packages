import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppShell, appShellVariants } from "./index";

afterEach(cleanup);

describe("AppShell", () => {
  it("renders the default variant with header and main content", () => {
    render(
      <AppShell header={<header>Site header</header>}>
        <p>Dashboard content</p>
      </AppShell>,
    );

    expect(screen.getByText("Site header")).toBeTruthy();
    const main = screen.getByRole("main");
    expect(main.textContent).toContain("Dashboard content");
  });

  it("applies the default variant classes to the shell root", () => {
    const { container } = render(
      <AppShell header={<header>Site header</header>}>
        <p>Content</p>
      </AppShell>,
    );

    const root = container.firstElementChild;
    expect(root?.className).toContain("min-h-screen");
    expect(root?.className).toContain("relative");
  });

  it("renders the auth variant with centered card, footer, and variant classes", () => {
    const { container } = render(
      <AppShell variant="auth" footer="Need help? Contact support.">
        <p>Login form</p>
      </AppShell>,
    );

    expect(screen.getByText("Login form")).toBeTruthy();
    expect(screen.getByText("Need help? Contact support.")).toBeTruthy();

    const root = container.firstElementChild;
    expect(root?.className).toContain("bg-background");
    expect(root?.className).toContain("p-4");
  });

  it("omits the footer when not provided", () => {
    render(
      <AppShell variant="auth">
        <p>Login form</p>
      </AppShell>,
    );
    expect(screen.queryByText("Need help? Contact support.")).not.toBeTruthy();
  });

  it("exposes appShellVariants with both variants", () => {
    expect(appShellVariants({ variant: "auth" })).toContain("p-4");
    expect(appShellVariants()).toContain("relative");
  });
});
