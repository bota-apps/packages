import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Hero, heroTreatmentVariants, heroVariants } from "./index";

afterEach(cleanup);

describe("Hero", () => {
  it("renders children inside a relative, overflow-hidden section", () => {
    const { container } = render(
      <Hero>
        <h1>Build faster with a design system</h1>
      </Hero>,
    );
    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(section!.className).toContain("relative");
    expect(section!.className).toContain("overflow-hidden");
    expect(
      screen.getByRole("heading", { level: 1, name: "Build faster with a design system" }),
    ).toBeTruthy();
  });

  it("renders an aria-hidden, pointer-events-none decorative layer with the treatment class", () => {
    const { container } = render(
      <Hero treatment="glow">
        <p>Content</p>
      </Hero>,
    );
    const layer = container.querySelector('[aria-hidden="true"]');
    expect(layer).toBeTruthy();
    expect(layer!.className).toContain("pointer-events-none");
    expect(layer!.className).toContain("absolute");
    expect(layer!.className).toContain(
      "bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-100))_0%,transparent_60%)]",
    );
  });

  it("renders drifting, reduced-motion-aware blobs for the aurora treatment", () => {
    const { container } = render(
      <Hero treatment="aurora">
        <p>Content</p>
      </Hero>,
    );
    const layer = container.querySelector('[aria-hidden="true"]');
    expect(layer).toBeTruthy();
    const blobs = [...layer!.children];
    expect(blobs).toHaveLength(2);
    expect(blobs[0].className).toContain("animate-drift");
    expect(blobs[1].className).toContain("animate-drift-reverse");
    for (const blob of blobs) {
      expect(blob.className).toContain("motion-reduce:animate-none");
      expect(blob.className).toContain("blur-3xl");
    }
  });

  it("renders no decorative layer for the default treatment", () => {
    const { container } = render(
      <Hero>
        <p>Plain content</p>
      </Hero>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("renders the structured title/description/actions layout", () => {
    render(
      <Hero
        title="Ship projects in minutes"
        description="Everything you need."
        actions={<button type="button">Get started</button>}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Ship projects in minutes" }),
    ).toBeTruthy();
    expect(screen.getByText("Everything you need.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Get started" })).toBeTruthy();
  });

  it("applies alignment via the align variant", () => {
    const { container } = render(
      <Hero align="start">
        <p>Start-aligned content</p>
      </Hero>,
    );
    const section = container.querySelector("section");
    expect(section!.className).toContain("text-left");
    expect(heroVariants({ align: "center" })).toContain("text-center");
    expect(heroTreatmentVariants({ treatment: "tint" })).toContain("bg-primary-50");
    expect(heroTreatmentVariants({ treatment: "grid" })).toContain(
      "[mask-image:linear-gradient(to_bottom,black,transparent)]",
    );
  });
});
