import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DotLeader, dotLeaderVariants } from "./index";
import { Inline } from "../layout";

afterEach(cleanup);

describe("DotLeader", () => {
  it("fills the gap between a label and a value with a dotted rule", () => {
    render(
      <Inline align="baseline" data-testid="row">
        <span>Service fee</span>
        <DotLeader data-testid="leader" />
        <span>12,000.00</span>
      </Inline>,
    );
    const leader = screen.getByTestId("leader");
    expect(leader.className).toContain("flex-1");
    expect(leader.className).toContain("border-dotted");
    expect(leader.className).toContain("border-border/50");
    expect(dotLeaderVariants()).toContain("border-b");
  });

  it("is decorative — hidden from the accessibility tree", () => {
    render(<DotLeader data-testid="leader" />);
    expect(screen.getByTestId("leader").getAttribute("aria-hidden")).toBe("true");
  });
});
