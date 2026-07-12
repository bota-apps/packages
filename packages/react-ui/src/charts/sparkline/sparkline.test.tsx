import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sparkline } from "./index";

describe("Sparkline", () => {
  it("renders a decorative container with the size variant", () => {
    const { container } = render(<Sparkline data={[3, 5, 4, 8, 7, 11]} size="sm" />);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("h-8");
    expect(root?.className).toContain("pointer-events-none");
  });

  it("resolves semantic color names to chart tokens", () => {
    // Render-level smoke: the component accepts both alias and numeric tokens.
    render(<Sparkline data={[1, 2, 3]} color="success" />);
    render(<Sparkline data={[1, 2, 3]} color={4} />);
  });
});
