import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "../label";
import { PasswordInput, passwordInputToggleVariants } from "./index";

afterEach(cleanup);

describe("PasswordInput", () => {
  it("associates with a Label, accepts typing, and masks by default", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" />
      </div>,
    );
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
    await user.type(input, "hunter2");
    expect(input.value).toBe("hunter2");
  });

  it("toggles visibility via the show/hide button", async () => {
    const user = userEvent.setup();
    render(<PasswordInput data-testid="input" defaultValue="secret" />);
    const input = screen.getByTestId("input") as HTMLInputElement;
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle.className).toContain(passwordInputToggleVariants());

    await user.click(toggle);
    expect(input.type).toBe("text");
    expect(screen.getByRole("button", { name: "Hide password" })).toBe(toggle);

    await user.click(toggle);
    expect(input.type).toBe("password");
  });
});
