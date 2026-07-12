import { cleanup, render } from "@testing-library/react";
import { Rocket } from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";
import { IconBadge } from "./index";

afterEach(cleanup);

describe("IconBadge", () => {
  it("renders the icon inside a square tile with default tone and size", () => {
    const { container } = render(<IconBadge icon={Rocket} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.querySelector("svg")).toBeTruthy();
    // Defaults: size="md" (40px tile, 20px glyph), shape="square", tone="primary".
    expect(badge.className).toContain("rounded-lg");
    expect(badge.className).toContain("h-10");
    expect(badge.className).toContain("[&_svg]:size-5");
    expect(badge.className).toContain("bg-primary/10");
  });

  it("applies tone, size, and shape variant classes from iconBadgeVariants", () => {
    const { container } = render(
      <IconBadge icon={Rocket} size="lg" shape="circle" tone="success" />,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("h-12");
    expect(badge.className).toContain("rounded-full");
    expect(badge.className).toContain("bg-emerald-500/10");
  });

  it("scales the tile radius with the xl square size", () => {
    const { container } = render(<IconBadge icon={Rocket} size="xl" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("h-16");
    expect(badge.className).toContain("rounded-xl");
  });
});
