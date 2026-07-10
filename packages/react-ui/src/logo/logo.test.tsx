import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Logo } from "./index";

afterEach(cleanup);

describe("Logo", () => {
  it("renders the default logo image and wordmark", () => {
    render(<Logo />);
    expect(screen.getByAltText("Bota Apps logo")).toBeTruthy();
    const wordmark = screen.getByText("Bota Apps");
    expect(wordmark.className).toContain("font-bold");
  });

  it("renders an app-provided name, source, and alt", () => {
    render(<Logo name="Acme" src="/brand/acme.svg" alt="Acme brand mark" />);
    const img = screen.getByAltText("Acme brand mark");
    expect(img.getAttribute("src")).toBe("/brand/acme.svg");
    expect(screen.getByText("Acme")).toBeTruthy();
  });
});
