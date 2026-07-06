import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Message } from "./index";
import { alertVariants } from "./variants";

afterEach(cleanup);

describe("Message", () => {
  it("renders title and description", () => {
    const { container } = render(
      <Message title="Profile updated" description="Your changes have been saved." />,
    );

    expect(screen.getByText("Profile updated")).toBeTruthy();
    expect(screen.getByText("Your changes have been saved.")).toBeTruthy();
    // Neutral is the default variant from html/alert.
    expect(container.firstElementChild?.className).toContain("bg-muted");
  });

  it("applies variant classes from the shared alertVariants", () => {
    const { container } = render(<Message variant="error" description="Something failed." />);

    expect(container.firstElementChild?.className).toContain("text-destructive");
    expect(alertVariants({ variant: "error" })).toContain("bg-destructive/10");
  });

  it("sanitizes trusted html content", () => {
    const { container } = render(
      <Message
        html={"Expires in <strong>5 minutes</strong>.<script>window.pwned = true;</script>"}
      />,
    );

    expect(container.querySelector("strong")?.textContent).toBe("5 minutes");
    expect(container.querySelector("script")).toBe(null);
  });
});
