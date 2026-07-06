import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  trVariants,
} from "./index";

function renderTable() {
  return render(
    <Table>
      <TableCaption>Project budgets</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead align="right">Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-testid="row-project">
          <TableCell>Website redesign</TableCell>
          <TableCell align="right">12,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
}

afterEach(cleanup);

describe("Table", () => {
  it("renders semantic table structure with caption", () => {
    renderTable();
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText("Project budgets").tagName).toBe("CAPTION");
    expect(screen.getByRole("columnheader", { name: "Project" })).toBeTruthy();
    expect(screen.getByRole("cell", { name: "Website redesign" })).toBeTruthy();
  });

  it("applies the row variant classes and align variants", () => {
    renderTable();
    const row = screen.getByTestId("row-project");
    expect(row.className).toContain("border-b");
    const budgetHeader = screen.getByRole("columnheader", { name: "Budget" });
    expect(budgetHeader.className).toContain("text-right");
    const budgetCell = screen.getByRole("cell", { name: "12,000" });
    expect(budgetCell.className).toContain("text-right");
  });

  it("exposes the tr severity variants for consumers", () => {
    expect(trVariants({ severity: "warning" })).toContain("bg-yellow-50");
    expect(trVariants({ clickable: true })).toContain("cursor-pointer");
  });

  it("wraps the table in a horizontal scroll container", () => {
    renderTable();
    const table = screen.getByRole("table");
    expect(table.parentElement?.className).toContain("overflow-auto");
  });
});
