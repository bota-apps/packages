import { cleanup, render } from "@testing-library/react";
import { Rocket } from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";
import { IconBadge } from "./index";

afterEach(cleanup);

describe("IconBadge", () => {
  it("renders the icon inside a circular container with default tone and size", () => {
    const { container } = render(<IconBadge icon={Rocket} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.querySelector("svg")).toBeTruthy();
    expect(badge.className).toContain("rounded-full");
    // Defaults: size="lg", tone="primary".
    expect(badge.className).toContain("h-16");
    expect(badge.className).toContain("bg-primary/10");
  });

  it("applies tone and size variant classes from iconBadgeVariants", () => {
    const { container } = render(<IconBadge icon={Rocket} size="md" tone="success" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("h-12");
    expect(badge.className).toContain("bg-emerald-500/10");
  });
});
