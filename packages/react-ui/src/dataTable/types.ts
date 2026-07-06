import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";

export type {
  SortingState,
  PaginationState,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";

type CellVariant = "default" | "muted";

export type ColumnDef<T> = {
  accessorKey?: keyof T & string;
  accessorFn?: (row: T) => string | number;
  id?: string;
  header: string;
  cell?: (row: T) => ReactNode;
  variant?: CellVariant;
  align?: "left" | "right" | "center";
  enableSorting?: boolean;
};

export type DataTableLayout = "table" | "list" | "grid";

export type DropdownFilterOption = {
  label: string;
  value: string;
};

export type DropdownFilter<T> = {
  id: string;
  label: string;
  options: DropdownFilterOption[];
  predicate: (row: T, selectedValue: string) => boolean;
};

export type BulkAction<T> = {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
  onAction: (selectedRows: T[]) => void;
};

export type RowAction<T> =
  | {
      label: string;
      icon?: LucideIcon;
      variant?: "default" | "destructive";
      onAction: (row: T) => void;
    }
  | { type: "separator" };

export type DataTableTranslations = {
  /** Label for "N selected" — receives {{count}} interpolation. */
  selected?: string;
  /** Label for "Clear" / "Clear selection" button. */
  clear?: string;
  /** Label for the "All" option in dropdown filters. */
  all?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  sorting?: boolean;
  pagination?: { pageSize: number };
  onRowClick?: (row: T) => void;
  /** Tints the row background based on a per-row severity. Return undefined for no tint. */
  getRowSeverity?: (row: T) => "warning" | "error" | undefined;
  EmptyComponent?: ReactNode;

  pageCount?: number;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;

  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;

  mobileRenderItem?: (row: T) => ReactNode;

  /** Enables global search input in toolbar. */
  searchable?: boolean;
  searchPlaceholder?: string;

  /** Available layout modes. Requires renderItem for non-table layouts. */
  layouts?: DataTableLayout[];
  defaultLayout?: DataTableLayout;
  /** Card renderer for list/grid layouts. Falls back to mobileRenderItem. */
  renderItem?: (row: T) => ReactNode;

  /** Enables checkbox column + select-all header. */
  enableRowSelection?: boolean;
  onSelectionChange?: (rows: T[]) => void;

  /** Per-dimension dropdown filter selectors shown in toolbar. */
  dropdownFilters?: DropdownFilter<T>[];

  /** Bulk actions shown when rows are selected. */
  bulkActions?: BulkAction<T>[];

  /** Per-row "..." action menu. Required — pass [] to suppress the menu. */
  rowActions: RowAction<T>[] | ((row: T) => RowAction<T>[]);

  /** Override default English toolbar labels. */
  translations?: DataTableTranslations;
};
