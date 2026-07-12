import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable, type ColumnDef } from "./index";

afterEach(() => {
  vi.restoreAllMocks();
});

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

  // The table-to-cards switch is container-scoped: it reacts to the width the
  // table was given, never the viewport.
  describe("container-scoped card switch", () => {
    const renderCard = (p: Project) => <span>{`card:${p.name}`}</span>;

    it("renders cards when the measured container is narrow", () => {
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
        DOMRect.fromRect({ width: 360, height: 400 }),
      );
      render(
        <DataTable
          data={projects}
          columns={columns}
          searchable={false}
          mobileRenderItem={renderCard}
          rowActions={[]}
        />,
      );
      expect(screen.getByText("card:Noah Patel")).toBeTruthy();
      expect(screen.queryByRole("table")).toBeNull();
    });

    it("renders the table when the measured container is wide", () => {
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
        DOMRect.fromRect({ width: 900, height: 400 }),
      );
      render(
        <DataTable
          data={projects}
          columns={columns}
          searchable={false}
          mobileRenderItem={renderCard}
          rowActions={[]}
        />,
      );
      expect(screen.getByRole("table")).toBeTruthy();
      expect(screen.queryByText("card:Noah Patel")).toBeNull();
    });
  });

  // Regression: with BOTH onRowClick and rowActions wired, the row-action menu
  // lives inside the clickable row, and React synthetic events bubble up the
  // React tree (portalled menu content included). Opening the menu or picking
  // an item must NOT also fire the row's onRowClick.
  describe("row-action menu on a clickable row", () => {
    function renderClickableRowWithActions() {
      const onRowClick = vi.fn();
      const onAction = vi.fn();
      render(
        <DataTable
          data={projects}
          columns={columns}
          searchable={false}
          onRowClick={onRowClick}
          rowActions={[{ label: "Archive", onAction }]}
        />,
      );
      return { onRowClick, onAction };
    }

    it("opening the menu does not fire onRowClick", async () => {
      const user = userEvent.setup();
      const { onRowClick } = renderClickableRowWithActions();

      await user.click(within(getBodyRows()[0]).getByRole("button", { name: /open menu/i }));

      expect(await screen.findByRole("menuitem", { name: "Archive" })).toBeTruthy();
      expect(onRowClick).not.toHaveBeenCalled();
    });

    it("clicking a menu item fires the action but not onRowClick", async () => {
      const user = userEvent.setup();
      const { onRowClick, onAction } = renderClickableRowWithActions();

      await user.click(within(getBodyRows()[0]).getByRole("button", { name: /open menu/i }));
      await user.click(await screen.findByRole("menuitem", { name: "Archive" }));

      expect(onAction).toHaveBeenCalledWith(projects[0]);
      expect(onRowClick).not.toHaveBeenCalled();
    });

    it("clicking the row itself still fires onRowClick", async () => {
      const user = userEvent.setup();
      const { onRowClick } = renderClickableRowWithActions();

      await user.click(within(getBodyRows()[0]).getByText("Noah Patel"));

      expect(onRowClick).toHaveBeenCalledWith(projects[0]);
    });
  });
});
