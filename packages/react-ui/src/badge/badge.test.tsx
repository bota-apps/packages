import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "./index";

afterEach(cleanup);

describe("Badge", () => {
  it("renders content with className passthrough", () => {
    render(<Badge className="badge-x">Active</Badge>);
    expect(screen.getByText("Active").className).toContain("badge-x");
  });

  it("applies variant classes from badgeVariants", () => {
    render(<Badge variant="secondary">Draft</Badge>);
    expect(screen.getByText("Draft").className).toContain("bg-secondary");
  });
});
