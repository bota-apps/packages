import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "../button";
import { ErrorState, errorStateVariants, errorStateIconVariants } from "./index";

afterEach(cleanup);

describe("ErrorState", () => {
  it("renders title, description, and action", () => {
    render(
      <ErrorState
        title="Something went wrong"
        description="We could not load this page."
        action={<Button>Retry</Button>}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Something went wrong" })).toBeTruthy();
    expect(screen.getByText("We could not load this page.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });

  it("applies the base variant classes to the container", () => {
    render(<ErrorState title="Failed" description="Try again later." />);
    const root = screen.getByRole("heading", { name: "Failed" }).parentElement as HTMLElement;
    expect(root.className).toContain("py-10");
    expect(root.className).toContain("text-center");
    expect(errorStateVariants()).toContain("px-4");
  });

  it("renders the icon slot with destructive styling", () => {
    render(
      <ErrorState
        icon={<svg data-testid="error-icon" />}
        title="Load error"
        description="Check your connection."
      />,
    );
    const iconWrapper = screen.getByTestId("error-icon").parentElement as HTMLElement;
    expect(iconWrapper.className).toContain("text-destructive");
    expect(errorStateIconVariants()).toContain("text-destructive");
  });
});
