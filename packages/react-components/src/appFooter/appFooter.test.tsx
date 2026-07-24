import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppFooter } from "./index";

describe("AppFooter", () => {
  it("renders the legal line and link entries as a contentinfo landmark", () => {
    render(
      <AppFooter
        legal="© 2026 Example Co."
        links={[
          { label: "Terms of Service", href: "/legal/terms" },
          { label: "Privacy Policy", href: "/legal/privacy" },
        ]}
      />,
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer.textContent).toContain("© 2026 Example Co.");
    expect(screen.getByRole("link", { name: "Terms of Service" }).getAttribute("href")).toBe(
      "/legal/terms",
    );
    expect(screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe(
      "/legal/privacy",
    );
  });

  it("delegates link rendering to renderLink for router integration", () => {
    render(
      <AppFooter
        links={[{ label: "Terms of Service", href: "/legal/terms" }]}
        renderLink={(link) => <button type="button">{link.label}</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Terms of Service" })).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
