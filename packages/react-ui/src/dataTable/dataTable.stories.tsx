import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Trash2, Download } from "lucide-react";
import type { Money } from "@bota-apps/types";
import { Badge } from "../badge";
import { CurrencyText } from "../currencyText";
import { DataTable, type ColumnDef } from "./index";

type Project = {
  id: string;
  name: string;
  department: string;
  status: "active" | "on-hold" | "archived";
  budget: Money;
  hiredOn: string;
};

const projects: Project[] = [
  {
    id: "e1",
    name: "Jane Doe",
    department: "Engineering",
    status: "active",
    budget: { amount: 45000, currency: "USD" },
    hiredOn: "2023-02-14",
  },
  {
    id: "e2",
    name: "John Smith",
    department: "Finance",
    status: "active",
    budget: { amount: 38000, currency: "USD" },
    hiredOn: "2022-11-01",
  },
  {
    id: "e3",
    name: "Ada Lovelace",
    department: "Engineering",
    status: "on-hold",
    budget: { amount: 52000, currency: "USD" },
    hiredOn: "2021-06-20",
  },
  {
    id: "e4",
    name: "Liam Chen",
    department: "Operations",
    status: "active",
    budget: { amount: 29500, currency: "USD" },
    hiredOn: "2024-01-08",
  },
  {
    id: "e5",
    name: "Maria Garcia",
    department: "Finance",
    status: "archived",
    budget: { amount: 33000, currency: "USD" },
    hiredOn: "2020-09-15",
  },
  {
    id: "e6",
    name: "Noah Patel",
    department: "Operations",
    status: "active",
    budget: { amount: 31000, currency: "USD" },
    hiredOn: "2023-07-03",
  },
];

const statusBadge: Record<
  Project["status"],
  { label: string; variant: "success" | "warning" | "muted" }
> = {
  active: { label: "Active", variant: "success" },
  "on-hold": { label: "On hold", variant: "warning" },
  archived: { label: "Archived", variant: "muted" },
};

const columns: ColumnDef<Project>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "department", header: "Department", variant: "muted" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => (
      <Badge variant={statusBadge[row.status].variant}>{statusBadge[row.status].label}</Badge>
    ),
  },
  {
    id: "budget",
    header: "Budget",
    accessorFn: (row) => row.budget.amount,
    cell: (row) => <CurrencyText value={row.budget} size="sm" />,
    align: "right",
  },
  { accessorKey: "hiredOn", header: "Hired", variant: "muted", enableSorting: false },
];

const meta: Meta<typeof DataTable<Project>> = {
  title: "Display/DataTable",
  component: DataTable,
};
export default meta;

type Story = StoryObj<typeof DataTable<Project>>;

/** Sorting (click a header), global search in the toolbar, and a per-row "…" action menu. */
export const Default: Story = {
  render: () => (
    <DataTable
      data={projects}
      columns={columns}
      sorting
      searchPlaceholder="Search projects…"
      rowActions={[
        { label: "Edit", icon: Pencil, onAction: () => {} },
        { type: "separator" },
        { label: "Delete", icon: Trash2, variant: "destructive", onAction: () => {} },
      ]}
    />
  ),
};

/** Checkbox selection with bulk actions appearing in the toolbar once rows are selected. */
export const RowSelection: Story = {
  render: () => (
    <DataTable
      data={projects}
      columns={columns}
      rowActions={[]}
      bulkActions={[
        { label: "Export", icon: Download, onAction: () => {} },
        { label: "Delete", icon: Trash2, variant: "destructive", onAction: () => {} },
      ]}
    />
  ),
};

/** Dropdown filter by department plus client-side pagination. */
export const FiltersAndPagination: Story = {
  render: () => (
    <DataTable
      data={projects}
      columns={columns}
      sorting
      pagination={{ pageSize: 4 }}
      dropdownFilters={[
        {
          id: "department",
          label: "Department",
          options: [
            { label: "Engineering", value: "Engineering" },
            { label: "Finance", value: "Finance" },
            { label: "Operations", value: "Operations" },
          ],
          predicate: (row, value) => row.department === value,
        },
      ]}
      rowActions={[]}
    />
  ),
};

/** Clickable rows with severity tinting (on-hold → warning, archived → error). */
export const RowClickAndSeverity: Story = {
  render: () => (
    <DataTable
      data={projects}
      columns={columns}
      searchable={false}
      onRowClick={() => {}}
      getRowSeverity={(row) =>
        row.status === "archived" ? "error" : row.status === "on-hold" ? "warning" : undefined
      }
      rowActions={[]}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={columns}
      searchable={false}
      EmptyComponent="No projects found."
      rowActions={[]}
    />
  ),
};

/**
 * The table-to-cards switch is container-scoped: the same table renders cards
 * in a narrow panel (below ~640px of its own width) and rows in a wide one —
 * regardless of the viewport.
 */
export const ContainerScopedCards: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="w-80">
        <DataTable
          data={projects}
          columns={columns}
          searchable={false}
          mobileRenderItem={(row) => (
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{row.name}</span>
                <Badge variant={statusBadge[row.status].variant}>
                  {statusBadge[row.status].label}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">{row.department}</div>
              <CurrencyText value={row.budget} size="sm" />
            </div>
          )}
          rowActions={[]}
        />
      </div>
      <div className="min-w-[42rem] flex-1">
        <DataTable
          data={projects}
          columns={columns}
          searchable={false}
          mobileRenderItem={(row) => (
            <div className="space-y-1">
              <span className="text-sm font-medium">{row.name}</span>
              <div className="text-xs text-muted-foreground">{row.department}</div>
            </div>
          )}
          rowActions={[]}
        />
      </div>
    </div>
  ),
};
