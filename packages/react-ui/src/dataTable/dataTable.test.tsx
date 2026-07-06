import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DataTable, type ColumnDef } from "./index";

type Project = {
  id: string;
  name: string;
  department: string;
};

const projects: Project[] = [
  { id: "e1", name: "Noah Patel", department: "Engineering" },
  { id: "e2", name: "Ada Lovelace", department: "Finance" },
  { id: "e3", name: "Maria Garcia", department: "Operations" },
];

const columns: ColumnDef<Project>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "department", header: "Department", variant: "muted" },
];

function getBodyRows() {
  // First row is the header row.
  return screen.getAllByRole("row").slice(1);
}

describe("DataTable", () => {
  it("renders headers and one cell per column for each row", () => {
    render(<DataTable data={projects} columns={columns} searchable={false} rowActions={[]} />);

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Department")).toBeTruthy();

    const rows = getBodyRows();
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getByText("Noah Patel")).toBeTruthy();
    expect(within(rows[0]).getByText("Engineering")).toBeTruthy();
    expect(within(rows[2]).getByText("Maria Garcia")).toBeTruthy();
  });

  it("sorts rows when a sortable header is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DataTable data={projects} columns={columns} sorting searchable={false} rowActions={[]} />,
    );

    // Unsorted: original data order.
    expect(getBodyRows()[0].textContent).toContain("Noah Patel");

    await user.click(screen.getByText("Name"));
    expect(getBodyRows()[0].textContent).toContain("Ada Lovelace");

    // Second click flips to descending.
    await user.click(screen.getByText("Name"));
    expect(getBodyRows()[0].textContent).toContain("Noah Patel");
  });

  it("renders the empty state when there are no rows", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        searchable={false}
        EmptyComponent="No projects found."
        rowActions={[]}
      />,
    );
    expect(screen.getByText("No projects found.")).toBeTruthy();
  });
});
