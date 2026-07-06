import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "./index";

afterEach(cleanup);

describe("Skeleton", () => {
  it("renders the pulse placeholder and merges className", () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-48" />);
    const el = screen.getByTestId("skeleton");
    expect(el.className).toContain("animate-pulse");
    expect(el.className).toContain("w-48");
  });
});
