import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Heading, Text, headingVariants, textVariants } from "./index";

afterEach(cleanup);

describe("Typography", () => {
  it("renders Heading with the requested element and size variant", () => {
    render(
      <Heading as="h1" size="xl">
        Annual report
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 1, name: "Annual report" });
    expect(heading.className).toContain("text-3xl");
    expect(heading.className).toContain("font-bold");
  });

  it("defaults Heading to h2 and applies tone", () => {
    render(
      <Heading size="md" tone="primary">
        Section
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Section" });
    expect(heading.className).toContain("text-primary");
    expect(headingVariants({ size: "md" })).toContain("text-xl");
  });

  it("renders Text with tone, size, and truncation variants", () => {
    render(
      <Text size="sm" tone="muted" truncate>
        Body copy
      </Text>,
    );
    const text = screen.getByText("Body copy");
    expect(text.tagName).toBe("P");
    expect(text.className).toContain("text-sm");
    expect(text.className).toContain("text-muted-foreground");
    expect(text.className).toContain("truncate");
    expect(textVariants({ tone: "destructive" })).toContain("text-destructive");
  });

  it("renders Text polymorphically", () => {
    render(
      <Text as="span" weight="semibold">
        Inline
      </Text>,
    );
    const span = screen.getByText("Inline");
    expect(span.tagName).toBe("SPAN");
    expect(span.className).toContain("font-semibold");
  });
});
