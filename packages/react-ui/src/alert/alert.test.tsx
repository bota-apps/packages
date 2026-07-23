import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./index";
import { alertVariants } from "./variants";

afterEach(cleanup);

describe("Alert", () => {
  it("renders with role=alert and composes title and description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Everything renders through shared tokens.</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Heads up");
    expect(alert.textContent).toContain("Everything renders through shared tokens.");
  });

  it("applies variant classes from the shared alertVariants", () => {
    render(<Alert variant="warning" description="Double-check the input." />);

    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-status-warning-subtle");
    expect(alertVariants({ variant: "warning" })).toContain("border-status-warning/30");
  });

  it("supports MessageProps passthrough like title/description props", () => {
    render(<Alert title="Saved" description="Changes stored." />);

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Saved");
    expect(alert.textContent).toContain("Changes stored.");
  });
});
