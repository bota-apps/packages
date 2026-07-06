import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Avatar, AvatarFallback, AvatarImage } from "./index";

afterEach(cleanup);

describe("Avatar", () => {
  it("renders the fallback while the image has not loaded, with base classes", () => {
    const { container } = render(
      <Avatar className="avatar-x">
        <AvatarImage src="/broken-image.png" alt="Broken" />
        <AvatarFallback>MH</AvatarFallback>
      </Avatar>,
    );
    // jsdom never fires the image load event, so the fallback shows.
    const fallback = screen.getByText("MH");
    expect(fallback.className).toContain("bg-muted");
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-full");
    expect(root.className).toContain("avatar-x");
  });
});
