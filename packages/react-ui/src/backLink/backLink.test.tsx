import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BackLink } from "./index";

afterEach(cleanup);

describe("BackLink", () => {
  it("renders the back arrow next to the link", () => {
    const { container } = render(
      <BackLink>
        <a href="#projects">Back to projects</a>
      </BackLink>,
    );

    expect(screen.getByRole("link", { name: "Back to projects" })).toBeTruthy();
    expect(container.querySelector("svg")).toBeTruthy();

    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("inline-flex");
    expect(wrapper?.className).toContain("text-muted-foreground");
  });
});
