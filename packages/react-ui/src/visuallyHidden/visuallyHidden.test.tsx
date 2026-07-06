import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { VisuallyHidden, visuallyHiddenVariants } from "./index";

afterEach(cleanup);

describe("VisuallyHidden", () => {
  it("keeps content in the accessibility tree while hiding it visually", () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Download report</VisuallyHidden>
      </button>,
    );
    // The hidden label still names the button for assistive technology.
    expect(screen.getByRole("button", { name: "Download report" })).toBeTruthy();
    const span = screen.getByText("Download report");
    expect(span.tagName).toBe("SPAN");
    expect(span.className).toContain("sr-only");
  });

  it("exposes the sr-only base variant", () => {
    expect(visuallyHiddenVariants()).toBe("sr-only");
  });
});
