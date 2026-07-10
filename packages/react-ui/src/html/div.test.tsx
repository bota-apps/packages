import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Div } from "./div";

afterEach(cleanup);

describe("Div", () => {
  it("renders a primary-tinted banner with a tinted bottom border and split padding", () => {
    render(
      <Div background="primary" border="bPrimary" paddingX="xl" paddingY="lg" data-testid="banner">
        Acme Supplies Co.
      </Div>,
    );
    const banner = screen.getByTestId("banner");
    expect(banner.className).toContain("bg-primary/10");
    expect(banner.className).toContain("border-b");
    expect(banner.className).toContain("border-primary/20");
    expect(banner.className).toContain("px-8");
    expect(banner.className).toContain("py-6");
  });

  it("renders a subtle primary band with the softer tinted border", () => {
    render(
      <Div
        background="primarySubtle"
        border="bPrimarySubtle"
        paddingX="xl"
        paddingY="md"
        data-testid="band"
      >
        Account 10-4482
      </Div>,
    );
    const band = screen.getByTestId("band");
    expect(band.className).toContain("bg-primary/5");
    expect(band.className).toContain("border-primary/10");
    expect(band.className).toContain("px-8");
    expect(band.className).toContain("py-4");
  });

  it("keeps the all-sides padding variant working alongside the split scales", () => {
    render(
      <Div padding="md" data-testid="padded">
        Content
      </Div>,
    );
    expect(screen.getByTestId("padded").className).toContain("p-4");
  });
});
