import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MoneyBreakdown, type MoneyBreakdownLine, type MoneyBreakdownSection } from "./index";

afterEach(cleanup);

const lines: MoneyBreakdownLine[] = [
  { id: "base", label: "Base charge", value: "$1,200.00" },
  { id: "handling", label: "Handling", value: "$85.00" },
  { id: "adjustment", label: "Promotional adjustment", value: "$60.00", negative: true },
];

const total: MoneyBreakdownLine = { id: "total", label: "Total due", value: "$1,225.00" };

describe("MoneyBreakdown", () => {
  it("renders every line label, its amount, and the grand total", () => {
    render(<MoneyBreakdown lines={lines} total={total} ariaLabel="Charge summary" />);

    const group = screen.getByRole("group", { name: "Charge summary" });
    expect(within(group).getByText("Base charge")).toBeTruthy();
    expect(within(group).getByText("$1,200.00")).toBeTruthy();
    expect(within(group).getByText("Handling")).toBeTruthy();
    expect(within(group).getByText("Total due")).toBeTruthy();
    expect(within(group).getByText("$1,225.00")).toBeTruthy();
  });

  it("uses an accessible description-list structure pairing labels with amounts", () => {
    const { container } = render(<MoneyBreakdown lines={lines} total={total} />);

    const list = container.querySelector("dl");
    expect(list).not.toBeNull();
    // Three lines + the total = four dt/dd pairs.
    expect(container.querySelectorAll("dt")).toHaveLength(4);
    expect(container.querySelectorAll("dd")).toHaveLength(4);
  });

  it("renders grouped sections with titles and per-group subtotals", () => {
    const sections: MoneyBreakdownSection[] = [
      {
        id: "charges",
        title: "Charges",
        lines: [{ id: "base", label: "Base charge", value: "$1,200.00" }],
        subtotal: { id: "sub", label: "Charges subtotal", value: "$1,200.00" },
      },
      {
        id: "adjustments",
        title: "Adjustments",
        lines: [{ id: "credit", label: "Account credit", value: "$100.00", negative: true }],
      },
    ];
    render(
      <MoneyBreakdown
        sections={sections}
        total={{ id: "total", label: "Net total", value: "$1,100.00" }}
        ariaLabel="Statement summary"
      />,
    );

    expect(screen.getByText("Charges")).toBeTruthy();
    expect(screen.getByText("Adjustments")).toBeTruthy();
    const subtotalRow = screen.getByText("Charges subtotal").closest("[data-emphasis]");
    expect(subtotalRow?.getAttribute("data-emphasis")).toBe("subtotal");
    expect(screen.getByText("Net total")).toBeTruthy();
  });

  it("prefixes deducted amounts with a real minus sign, not color alone", () => {
    render(<MoneyBreakdown lines={lines} total={total} />);

    const negativeRow = screen.getByText("Promotional adjustment").closest("[data-emphasis]");
    // The U+2212 minus glyph is present in the row text — an announced signal.
    expect(negativeRow?.textContent).toContain("−");
    expect(negativeRow?.textContent).toContain("$60.00");
  });

  it("marks the grand total as a distinct row", () => {
    render(<MoneyBreakdown lines={lines} total={total} />);

    const totalRow = screen.getByText("Total due").closest("[data-emphasis]");
    expect(totalRow?.getAttribute("data-emphasis")).toBe("total");
    // Ordinary lines are not flagged as the total.
    const ordinaryRow = screen.getByText("Base charge").closest("[data-emphasis]");
    expect(ordinaryRow?.getAttribute("data-emphasis")).toBe("default");
  });

  it("renders a total-only summary when no lines are supplied", () => {
    const { container } = render(
      <MoneyBreakdown total={{ id: "total", label: "Balance", value: "$0.00" }} />,
    );

    expect(screen.getByText("Balance")).toBeTruthy();
    expect(container.querySelectorAll("dt")).toHaveLength(1);
  });
});
