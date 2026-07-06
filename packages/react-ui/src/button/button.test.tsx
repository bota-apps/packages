import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./index";

afterEach(cleanup);

describe("Button", () => {
  it("merges className, forwards props and ref, and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="custom-class" data-testid="btn" onClick={onClick}>
        Save
      </Button>,
    );
    const btn = screen.getByTestId("btn");
    expect(btn.className).toContain("custom-class");
    expect(ref.current).toBe(btn);
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies variant classes from buttonVariants", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button", { name: "Delete" }).className).toContain("bg-destructive");
  });
});
