import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { EmailText } from "./index";

afterEach(cleanup);

describe("EmailText", () => {
  it("renders the address as a plain span by default", () => {
    render(<EmailText email="user@example.com" />);
    const el = screen.getByText("user@example.com");
    expect(el.tagName).toBe("SPAN");
    expect(el.className).toContain("font-mono");
  });

  it("renders a mailto link when linked", () => {
    render(<EmailText email="user@example.com" linked />);
    const link = screen.getByRole("link", { name: "user@example.com" });
    expect(link.getAttribute("href")).toBe("mailto:user@example.com");
    expect(link.className).toContain("hover:underline");
  });

  it("applies size and tone variant classes", () => {
    render(<EmailText email="user@example.com" size="sm" tone="muted" />);
    const el = screen.getByText("user@example.com");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("text-muted-foreground");
  });
});
