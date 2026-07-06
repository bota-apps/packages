import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Page, PageContent, ContentSurface, pageVariants, pageContentVariants } from "./index";

afterEach(cleanup);

describe("Page", () => {
  it("renders flow layout by default and fixed layout on request", () => {
    const { container, rerender } = render(<Page>Body</Page>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.textContent).toBe("Body");
    expect(root.className).not.toContain("h-full");

    rerender(<Page layout="fixed">Body</Page>);
    const fixed = container.firstElementChild as HTMLElement;
    expect(fixed.className).toContain("flex");
    expect(fixed.className).toContain("h-full");
    expect(pageVariants({ layout: "fixed" })).toContain("flex-col");
  });

  it("applies PageContent width and region variants", () => {
    render(
      <div>
        <PageContent>default</PageContent>
        <PageContent variant="narrow">narrow</PageContent>
        <PageContent region="body">body</PageContent>
      </div>,
    );
    expect(screen.getByText("default").className).toContain("max-w-7xl");
    expect(screen.getByText("narrow").className).toContain("max-w-2xl");
    const body = screen.getByText("body");
    expect(body.className).toContain("overflow-y-auto");
    expect(pageContentVariants({ region: "header" })).toContain("pt-6");
  });

  it("renders ContentSurface children", () => {
    render(
      <ContentSurface>
        <p>Surface content</p>
      </ContentSurface>,
    );
    expect(screen.getByText("Surface content")).toBeTruthy();
  });
});
