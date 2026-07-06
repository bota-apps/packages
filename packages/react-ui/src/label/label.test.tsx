import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Description, Label, labelVariants } from "./index";

afterEach(cleanup);

describe("Label", () => {
  it("associates with a control via htmlFor", () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </div>,
    );
    const input = screen.getByLabelText("Email");
    expect((input as HTMLInputElement).id).toBe("email");
  });

  it("merges className, forwards ref, and applies the default variant", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(
      <Label ref={ref} className="custom-class" data-testid="label">
        Name
      </Label>,
    );
    const label = screen.getByTestId("label");
    expect(ref.current).toBe(label);
    expect(label.className).toContain("custom-class");
    expect(label.className).toContain("font-medium");
  });

  it("renders Description with the description variant classes", () => {
    render(<Description data-testid="description">Shown under the field.</Description>);
    const description = screen.getByTestId("description");
    expect(description.className).toContain("text-muted-foreground");
    expect(description.className).toContain("text-xs");
    expect(labelVariants({ variant: "description" })).toContain("font-normal");
  });
});
