import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "./index";

afterEach(cleanup);

describe("Skeleton", () => {
  it("renders the shimmer placeholder and merges className", () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-48" />);
    const el = screen.getByTestId("skeleton");
    expect(el.className).toContain("animate-shimmer");
    expect(el.className).toContain("motion-reduce:animate-none");
    expect(el.className).toContain("w-48");
  });
});
