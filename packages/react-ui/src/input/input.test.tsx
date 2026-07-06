import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "../label";
import { Input, inputVariants } from "./index";

afterEach(cleanup);

describe("Input", () => {
  it("associates with a Label and accepts typing", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" />
      </div>,
    );
    const input = screen.getByLabelText("Full name");
    await user.type(input, "Musema");
    expect((input as HTMLInputElement).value).toBe("Musema");
  });

  it("merges className and forwards props and ref", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} className="custom-class" data-testid="input" placeholder="Email" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("custom-class");
    expect(ref.current).toBe(input);
    expect(input.getAttribute("placeholder")).toBe("Email");
  });

  it("applies width variant classes", () => {
    render(
      <div>
        <Input data-testid="full" />
        <Input data-testid="auto" width="auto" />
      </div>,
    );
    expect(screen.getByTestId("full").className).toContain("w-full");
    expect(screen.getByTestId("auto").className).toContain("min-w-[12rem]");
    expect(inputVariants({ width: "auto" })).toContain("flex-1");
  });
});
