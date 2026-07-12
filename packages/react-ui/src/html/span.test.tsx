import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Span } from "./span";

afterEach(cleanup);

describe("Span", () => {
  it("renders the responsive visibility display variants", () => {
    render(
      <>
        <Span display="srOnlyMobile">Label</Span>
        <Span display="hiddenMobile">Hint</Span>
      </>,
    );
    expect(screen.getByText("Label").className).toContain("sr-only sm:not-sr-only");
    expect(screen.getByText("Hint").className).toContain("hidden sm:inline-flex");
  });
});
