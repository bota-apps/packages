import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Logo } from "./index";

afterEach(cleanup);

describe("Logo", () => {
  it("renders the logo image and wordmark", () => {
    render(<Logo />);
    expect(screen.getByAltText("Demoz Logo")).toBeTruthy();
    const wordmark = screen.getByText("Demoz");
    expect(wordmark.className).toContain("font-bold");
  });
});
