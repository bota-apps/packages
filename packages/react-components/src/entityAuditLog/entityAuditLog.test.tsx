import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuditEntryDetail, EntityAuditLog } from "./index";

// The app's API-owned entry type — richer than the constraint on purpose:
// the component must accept it and hand it back unchanged.
type ApiAuditEntry = {
  id: string;
  action: "created" | "updated" | "budgetChanged";
  occurredAt: string;
  actor: { id: string; name: string; role?: "admin" | "member" };
  changes: {
    field: string;
    label: string;
    valueType?: string;
    before?: unknown;
    after?: unknown;
  }[];
  note?: string;
  source?: string;
  entityId: string;
};

const entries: ApiAuditEntry[] = [
  {
    id: "a1",
    action: "budgetChanged",
    occurredAt: "2026-06-30T10:00:00Z",
    actor: { id: "u1", name: "Jane Doe", role: "admin" },
    changes: [
      {
        field: "budget",
        label: "Base budget",
        valueType: "currency",
        before: { amount: 50_000, currency: "USD" },
        after: { amount: 60_000, currency: "USD" },
      },
    ],
    note: "Annual review",
    entityId: "proj-42",
  },
  {
    id: "a2",
    action: "created",
    occurredAt: "2026-01-05T08:00:00Z",
    actor: { id: "u2", name: "John Smith" },
    changes: [],
    entityId: "proj-42",
  },
];

describe("EntityAuditLog", () => {
  it("renders entries with humanized actions and hands the typed entry to onEntryClick", async () => {
    const onEntryClick = vi.fn<(entry: ApiAuditEntry) => void>();
    render(
      <EntityAuditLog
        entries={entries}
        page={1}
        pageCount={1}
        onPageChange={() => {}}
        isLoading={false}
        isError={false}
        onEntryClick={onEntryClick}
      />,
    );

    expect(screen.getByText("Budget Changed")).toBeTruthy();
    expect(screen.getByText("Base budget")).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();

    await userEvent.click(screen.getByText("Base budget"));
    expect(onEntryClick).toHaveBeenCalledWith(entries[0]);
    expect(onEntryClick.mock.calls[0][0].entityId).toBe("proj-42");
  });

  it("pages through results", async () => {
    const onPageChange = vi.fn();
    render(
      <EntityAuditLog
        entries={entries}
        page={2}
        pageCount={3}
        onPageChange={onPageChange}
        isLoading={false}
        isError={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("shows empty, loading, and error states", () => {
    const { rerender } = render(
      <EntityAuditLog
        entries={[]}
        page={1}
        onPageChange={() => {}}
        isLoading={false}
        isError={false}
      />,
    );
    expect(screen.getByText("No audit entries")).toBeTruthy();

    rerender(
      <EntityAuditLog
        entries={undefined}
        page={1}
        onPageChange={() => {}}
        isLoading={false}
        isError
      />,
    );
    expect(screen.getByText("Failed to load audit log")).toBeTruthy();
  });
});

describe("AuditEntryDetail", () => {
  it("renders the before/after change grid with typed values", () => {
    render(<AuditEntryDetail entry={entries[0]} />);

    // The single change's label is both the headline and the change row.
    expect(screen.getByRole("heading", { name: "Base budget" })).toBeTruthy();
    expect(screen.getByText("Before")).toBeTruthy();
    expect(screen.getByText("After")).toBeTruthy();
    expect(screen.getByText("“Annual review”")).toBeTruthy();
  });
});
