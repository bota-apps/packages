import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "../button";
import { EmptyState, emptyStateVariants, emptyStateIconVariants } from "./index";

afterEach(cleanup);

describe("EmptyState", () => {
  it("renders title, description, and action", () => {
    render(
      <EmptyState
        title="No results"
        description="Try a different filter."
        action={<Button>Clear filters</Button>}
      />,
    );
    expect(screen.getByText("No results")).toBeTruthy();
    expect(screen.getByText("Try a different filter.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeTruthy();
  });

  it("renders the title as a heading and applies the base variant classes", () => {
    render(<EmptyState title="Nothing here" description="Add your first record." />);
    const heading = screen.getByRole("heading", { level: 3, name: "Nothing here" });
    const root = heading.parentElement as HTMLElement;
    expect(root.className).toContain("py-10");
    expect(root.className).toContain("text-center");
    expect(emptyStateVariants()).toContain("px-4");
  });

  it("renders an icon slot with muted styling when an icon is given", () => {
    render(
      <EmptyState
        icon={<svg data-testid="empty-icon" />}
        title="No documents"
        description="Upload one to get started."
      />,
    );
    const iconWrapper = screen.getByTestId("empty-icon").parentElement as HTMLElement;
    expect(iconWrapper.className).toContain("text-muted-foreground");
    expect(emptyStateIconVariants()).toContain("mb-4");
  });

  it("renders the tinted variant with a circular selected-tint icon chip", () => {
    render(
      <EmptyState
        variant="tinted"
        icon={<svg data-testid="tinted-icon" />}
        title="No entries"
        description="Add one to get started."
      />,
    );
    const iconWrapper = screen.getByTestId("tinted-icon").parentElement as HTMLElement;
    expect(iconWrapper.className).toContain("bg-selected");
    expect(iconWrapper.className).toContain("text-selected-foreground");
    expect(iconWrapper.className).toContain("rounded-full");
    expect(iconWrapper.className).not.toContain("text-muted-foreground");
  });

  it("renders the action slot under the description in the tinted variant", () => {
    render(
      <EmptyState
        variant="tinted"
        icon={<svg data-testid="tinted-icon" />}
        title="No entries"
        description="Add one to get started."
        action={<Button>Add entry</Button>}
      />,
    );
    const description = screen.getByText("Add one to get started.");
    const button = screen.getByRole("button", { name: "Add entry" });
    const position = description.compareDocumentPosition(button);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
