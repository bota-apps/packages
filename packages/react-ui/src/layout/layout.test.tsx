import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Box, Center, Container, Grid, Inline, Stack, stackVariants, gridVariants } from "./index";

afterEach(cleanup);

describe("Layout primitives", () => {
  it("renders Stack as a flex column with the gap variant", () => {
    render(
      <Stack gap="md" data-testid="stack">
        <span>One</span>
        <span>Two</span>
      </Stack>,
    );
    const stack = screen.getByTestId("stack");
    expect(stack.className).toContain("flex-col");
    expect(stack.className).toContain("gap-4");
    expect(screen.getByText("One")).toBeTruthy();
    expect(screen.getByText("Two")).toBeTruthy();
    expect(stackVariants({ gap: "md" })).toContain("gap-4");
  });

  it("renders Inline with alignment and justify variants", () => {
    render(
      <Inline gap="sm" justify="between" data-testid="inline">
        <span>Left</span>
        <span>Right</span>
      </Inline>,
    );
    const inline = screen.getByTestId("inline");
    expect(inline.className).toContain("flex");
    expect(inline.className).toContain("items-center");
    expect(inline.className).toContain("justify-between");
    expect(inline.className).toContain("gap-2");
  });

  it("renders multi-column Grid with container-scoped columns inside its own @container wrapper", () => {
    render(
      <Grid columns={3} gap="lg" data-testid="grid">
        <span>Cell</span>
      </Grid>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid.className).toContain("grid");
    expect(grid.className).toContain("@4xl:grid-cols-3");
    // The @container scope lives on a wrapper, never on the grid itself.
    expect(grid.parentElement?.className).toContain("@container");
    expect(gridVariants({ columns: 2 })).toContain("@xl:grid-cols-2");
  });

  it("renders single-column Grid without a container wrapper", () => {
    render(
      <div data-testid="host">
        <Grid data-testid="grid">
          <span>Cell</span>
        </Grid>
      </div>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid.parentElement).toBe(screen.getByTestId("host"));
  });

  it("renders Stack as a fixed-width, non-shrinking column", () => {
    render(
      <Stack width="md" shrink="0" data-testid="fixed">
        <span>Date</span>
      </Stack>,
    );
    const fixed = screen.getByTestId("fixed");
    expect(fixed.className).toContain("w-32");
    expect(fixed.className).toContain("shrink-0");
  });

  it("renders Inline as a selectable row with padding, border, background, and indent", () => {
    render(
      <Inline
        paddingX="md"
        paddingY="md"
        borderBottom
        background="muted"
        indent="md"
        data-testid="row"
      >
        <span>Row</span>
      </Inline>,
    );
    const row = screen.getByTestId("row");
    expect(row.className).toContain("px-4");
    expect(row.className).toContain("py-2");
    expect(row.className).toContain("border-b");
    expect(row.className).toContain("bg-muted/20");
    // paddingX emits px-4 and indent emits pl-10; both survive twMerge and the
    // CSS cascade lets pl-10 win the left side (same as the raw-className original).
    expect(row.className).toContain("pl-10");
  });

  it("renders Inline as a document band with primary tint, top border, and xl padding", () => {
    render(
      <Inline
        justify="between"
        paddingX="xl"
        paddingY="xl"
        borderTop
        background="primary"
        data-testid="band"
      >
        <span>Amount due</span>
      </Inline>,
    );
    const band = screen.getByTestId("band");
    expect(band.className).toContain("px-8");
    expect(band.className).toContain("py-5");
    expect(band.className).toContain("border-t");
    expect(band.className).toContain("bg-primary/10");
  });

  it("renders Inline as an accented section header with the subtle primary tint", () => {
    render(
      <Inline
        paddingX="xl"
        paddingY="md"
        accent
        borderBottom
        background="primarySubtle"
        data-testid="header"
      >
        <span>Charges</span>
      </Inline>,
    );
    const header = screen.getByTestId("header");
    expect(header.className).toContain("border-l-[3px]");
    expect(header.className).toContain("border-l-primary");
    expect(header.className).toContain("border-b");
    expect(header.className).toContain("bg-primary/5");
  });

  it("renders Inline line items indented one step past the xl document padding", () => {
    render(
      <Inline align="baseline" paddingX="xl" paddingY="md" indent="xl" data-testid="line">
        <span>Service fee</span>
      </Inline>,
    );
    const line = screen.getByTestId("line");
    // paddingX emits px-8 and indent emits pl-12; both survive twMerge and the
    // CSS cascade lets pl-12 win the left side (same trick as the md pairing).
    expect(line.className).toContain("px-8");
    expect(line.className).toContain("pl-12");
  });

  it("renders Center, Container, and Box with their variants and polymorphic tags", () => {
    render(
      <Container as="main" padding="md" data-testid="container">
        <Center maxWidth="sm" data-testid="center">
          <Box position="relative" border="left" data-testid="box">
            Content
          </Box>
        </Center>
      </Container>,
    );
    const container = screen.getByTestId("container");
    expect(container.tagName).toBe("MAIN");
    expect(container.className).toContain("py-6");
    expect(screen.getByTestId("center").className).toContain("justify-center");
    expect(screen.getByTestId("center").className).toContain("max-w-3xl");
    const box = screen.getByTestId("box");
    expect(box.className).toContain("relative");
    expect(box.className).toContain("border-l-2");
  });
});
