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

  it("renders Grid with responsive column classes", () => {
    render(
      <Grid columns={3} gap="lg" data-testid="grid">
        <span>Cell</span>
      </Grid>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid.className).toContain("grid");
    expect(grid.className).toContain("lg:grid-cols-3");
    expect(gridVariants({ columns: 2 })).toContain("md:grid-cols-2");
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
