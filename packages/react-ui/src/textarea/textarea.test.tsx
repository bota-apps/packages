import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "../label";
import { Textarea, textareaVariants } from "./index";

afterEach(cleanup);

describe("Textarea", () => {
  it("associates with a Label and accepts typing", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Type your message here." />
      </div>,
    );
    const textarea = screen.getByLabelText("Message");
    await user.type(textarea, "Hello there");
    expect((textarea as HTMLTextAreaElement).value).toBe("Hello there");
  });

  it("merges className, forwards props and ref, and applies base variant classes", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} className="custom-class" data-testid="textarea" rows={4} />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea.className).toContain("custom-class");
    expect(textarea.className).toContain("min-h-[60px]");
    expect(textareaVariants()).toContain("rounded-md");
    expect(ref.current).toBe(textarea);
    expect((textarea as HTMLTextAreaElement).rows).toBe(4);
  });

  it("does not accept input when disabled", async () => {
    const user = userEvent.setup();
    render(<Textarea data-testid="textarea" disabled />);
    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
    await user.type(textarea, "nope");
    expect(textarea.value).toBe("");
  });
});
