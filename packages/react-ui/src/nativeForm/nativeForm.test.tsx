import type { FormEvent } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Input } from "../input";
import { Label } from "../label";
import { Form, formElVariants } from "./index";

afterEach(cleanup);

describe("Form (native)", () => {
  it("renders a form that submits its fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => e.preventDefault());
    render(
      <Form data-testid="form" onSubmit={onSubmit}>
        <Label htmlFor="native-name">Name</Label>
        <Input id="native-name" name="name" />
        <button type="submit">Submit</button>
      </Form>,
    );

    await user.type(screen.getByLabelText("Name"), "Musema");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("applies gap variant classes and merges className", () => {
    render(<Form data-testid="form" gap="md" className="custom-class" />);
    const form = screen.getByTestId("form");
    expect(form.className).toContain("flex-col");
    expect(form.className).toContain("gap-4");
    expect(form.className).toContain("custom-class");
    expect(formElVariants({ gap: "lg" })).toContain("gap-6");
  });
});
