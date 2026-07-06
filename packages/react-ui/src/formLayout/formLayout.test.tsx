import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ButtonGroup, FormField, FormGrid, formGridVariants } from "./index";

afterEach(cleanup);

describe("FormLayout", () => {
  it("renders FormField children with vertical spacing", () => {
    render(
      <FormField>
        <label htmlFor="name">Name</label>
        <input id="name" />
      </FormField>,
    );
    const input = screen.getByLabelText("Name");
    expect(input).toBeTruthy();
    expect((input.parentElement as HTMLElement).className).toContain("space-y-2");
  });

  it("applies the FormGrid columns variant", () => {
    render(
      <FormGrid columns={3}>
        <span>Field</span>
      </FormGrid>,
    );
    const grid = screen.getByText("Field").parentElement as HTMLElement;
    expect(grid.className).toContain("lg:grid-cols-3");
    expect(formGridVariants({ columns: 2 })).toContain("md:grid-cols-2");
    expect(formGridVariants({ columns: 2 })).not.toContain("lg:grid-cols-3");
  });

  it("renders ButtonGroup children in a row", () => {
    render(
      <ButtonGroup>
        <button type="button">Save</button>
        <button type="button">Cancel</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });
});
