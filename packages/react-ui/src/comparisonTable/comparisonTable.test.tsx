import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ComparisonTable, type ComparisonColumn, type ComparisonRow } from "./index";

afterEach(cleanup);

// A local sample type — proves the component is generic over the option type
// and carries no domain types of its own.
type SampleOption = {
  price: string;
  seats: string;
};

const columns: ComparisonColumn<SampleOption>[] = [
  { id: "a", option: { price: "$0", seats: "1" }, title: "Option A", subtitle: "Entry" },
  { id: "b", option: { price: "$12", seats: "5" }, title: "Option B", subtitle: "Team" },
  { id: "c", option: { price: "$29", seats: "20" }, title: "Option C", subtitle: "Scale" },
];

const rows: ComparisonRow<SampleOption>[] = [
  { id: "price", label: "Monthly price", render: (o) => o.price },
  { id: "seats", label: "Seats", render: (o) => o.seats },
];

/** The wide-layout table (cards are also in the DOM; scope queries to this). */
function getTable(name: string): HTMLElement {
  return screen.getByRole("table", { name });
}

describe("ComparisonTable", () => {
  it("renders one column header per option and one row per attribute", () => {
    render(<ComparisonTable columns={columns} rows={rows} ariaLabel="Options" />);

    const table = getTable("Options");
    // Leading attribute-corner header + one per option.
    const columnHeaders = within(table).getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(columns.length + 1);
    expect(within(table).getByText("Option A")).toBeTruthy();
    expect(within(table).getByText("Option B")).toBeTruthy();
    expect(within(table).getByText("Option C")).toBeTruthy();

    // Attribute labels are row headers; values render per option.
    expect(within(table).getByRole("rowheader", { name: /Monthly price/ })).toBeTruthy();
    expect(within(table).getByRole("rowheader", { name: /Seats/ })).toBeTruthy();
    expect(within(table).getAllByText("$12").length).toBeGreaterThan(0);
  });

  it("renders no buttons when not interactive", () => {
    render(<ComparisonTable columns={columns} rows={rows} ariaLabel="Options" />);

    expect(within(getTable("Options")).queryAllByRole("button")).toHaveLength(0);
  });

  it("reports the column id through onSelectColumn", () => {
    const onSelectColumn = vi.fn();
    render(
      <ComparisonTable
        columns={columns}
        rows={rows}
        ariaLabel="Options"
        onSelectColumn={onSelectColumn}
      />,
    );

    const table = getTable("Options");
    const optionB = within(table)
      .getAllByRole("columnheader")
      .find((header) => header.textContent?.includes("Option B"));
    expect(optionB).toBeTruthy();

    fireEvent.click(within(optionB as HTMLElement).getByRole("button"));
    expect(onSelectColumn).toHaveBeenCalledWith("b");
  });

  it("marks the selected column with aria-pressed selected semantics", () => {
    render(
      <ComparisonTable
        columns={columns}
        rows={rows}
        ariaLabel="Options"
        selectedColumnId="b"
        onSelectColumn={() => undefined}
      />,
    );

    const table = getTable("Options");
    const headers = within(table).getAllByRole("columnheader");
    const optionB = headers.find((header) => header.textContent?.includes("Option B"));
    const optionA = headers.find((header) => header.textContent?.includes("Option A"));

    const bButton = within(optionB as HTMLElement).getByRole("button");
    expect(bButton.getAttribute("aria-pressed")).toBe("true");
    expect(bButton.textContent).toContain("Selected");

    const aButton = within(optionA as HTMLElement).getByRole("button");
    expect(aButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("renders each state as a text badge, not color alone", () => {
    render(
      <ComparisonTable
        ariaLabel="Options"
        columns={[
          { ...columns[0], states: ["lowest"] },
          { ...columns[1], states: ["recommended"] },
          { ...columns[2], states: ["unavailable"] },
        ]}
        rows={rows}
        selectedColumnId="b"
      />,
    );

    const table = getTable("Options");
    expect(within(table).getByText("Lowest")).toBeTruthy();
    expect(within(table).getByText("Recommended")).toBeTruthy();
    expect(within(table).getByText("Unavailable")).toBeTruthy();
    // selectedColumnId adds the Selected marker even without an explicit state.
    expect(within(table).getByText("Selected")).toBeTruthy();
  });

  it("honors injected state labels", () => {
    render(
      <ComparisonTable
        ariaLabel="Options"
        columns={[{ ...columns[0], states: ["recommended"] }, columns[1], columns[2]]}
        rows={rows}
        stateLabels={{ recommended: "Best value" }}
      />,
    );

    expect(within(getTable("Options")).getByText("Best value")).toBeTruthy();
  });

  it("disables the select button for an unavailable option", () => {
    render(
      <ComparisonTable
        ariaLabel="Options"
        columns={[columns[0], columns[1], { ...columns[2], states: ["unavailable"] }]}
        rows={rows}
        onSelectColumn={() => undefined}
      />,
    );

    const table = getTable("Options");
    const optionC = within(table)
      .getAllByRole("columnheader")
      .find((header) => header.textContent?.includes("Option C"));
    const button = within(optionC as HTMLElement).getByRole("button");
    expect(button).toHaveProperty("disabled", true);
  });
});
