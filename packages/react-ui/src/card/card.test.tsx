import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "../badge";
import { Card } from "./index";

afterEach(cleanup);

describe("Card", () => {
  it("renders title and children with className passthrough", () => {
    const { container } = render(
      <Card className="card-x" title="Overview">
        <Badge className="badge-x">Active</Badge>
      </Card>,
    );
    expect(screen.getByText("Overview")).toBeTruthy();
    expect(screen.getByText("Active").className).toContain("badge-x");
    expect((container.firstChild as HTMLElement).className).toContain("card-x");
  });

  it("applies variant classes from cardVariants", () => {
    const { container } = render(<Card variant="compact" title="Dense" />);
    expect((container.firstChild as HTMLElement).className).toContain("p-4");
  });

  it("stretches to the parent cell with the fill prop", () => {
    const { container } = render(<Card fill title="Node" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-full");
    expect(el.className).toContain("w-full");
  });
});
