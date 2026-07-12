import { type ReactNode, type KeyboardEvent, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef as TanStackColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  TableScrollContainerEl,
  TableDataWrapperEl,
  TableEl,
  TheadEl,
  TbodyEl,
  TrEl,
  ThEl,
  TdEl,
  PaginationBarEl,
  PaginationInfoEl,
  PaginationButtonEl,
} from "../html";
import { Div, Span } from "../html";
import { Checkbox } from "../checkbox";
import { useContainerWidth } from "../lib/useContainerWidth";
import { useDataTableState } from "./useDataTableState";
import { SortIndicator } from "./sortIndicator";
import { DataTableToolbar } from "./dataTableToolbar";
import { DataTableRowActions } from "./dataTableRowActions";
import { dataTableCardListVariants, dataTableCardVariants } from "./variants";
import type { ColumnDef, DataTableProps, DataTableTranslations } from "./types";

export * from "./types";
export { DataTableRowActions } from "./dataTableRowActions";
export * from "./variants";

const defaultTranslations: Required<DataTableTranslations> = {
  selected: "{{count}} selected",
  clear: "Clear",
  all: "All",
};

/** Container width (px) below which the table renders cards instead of rows. */
const narrowContainerWidth = 640;

type CellVariant = "default" | "muted";

function renderDefaultCell(value: unknown, variant: CellVariant = "default") {
  const display = value == null || value === "" ? "\u2014" : String(value);
  if (variant === "muted") {
    return <Span tone="muted">{display}</Span>;
  }
  return <span>{display}</span>;
}

function getColumnAlign(meta: unknown): "left" | "center" | "right" | undefined {
  if (typeof meta !== "object" || meta === null || !("align" in meta)) {
    return undefined;
  }
  const { align } = meta;
  if (align === "left" || align === "center" || align === "right") {
    return align;
  }
  return undefined;
}

function toTanStackColumns<T>(
  columns: ColumnDef<T>[],
  tableSorting: boolean,
): TanStackColumnDef<T, unknown>[] {
  return columns.map((col): TanStackColumnDef<T, unknown> => {
    const cellFn = col.cell
      ? ({ row }: { row: { original: T } }) => col.cell!(row.original)
      : ({ getValue }: { getValue: () => unknown }) => renderDefaultCell(getValue(), col.variant);

    // Per-column enableSorting override
    const enableSorting = col.enableSorting !== undefined ? col.enableSorting : tableSorting;

    return {
      header: col.header,
      meta: { align: col.align },
      enableSorting,
      ...(col.accessorKey && { accessorKey: col.accessorKey }),
      ...(col.accessorFn && { accessorFn: col.accessorFn }),
      ...(col.id && { id: col.id }),
      cell: cellFn,
    };
  });
}

export function DataTable<T>({
  data,
  columns,
  sorting = false,
  pagination,
  onRowClick,
  getRowSeverity,
  EmptyComponent,
  pageCount: serverPageCount,
  paginationState,
  onPaginationChange,
  sortingState: serverSortingState,
  onSortingChange: serverOnSortingChange,
  mobileRenderItem,
  searchable = true,
  searchPlaceholder,
  layouts,
  defaultLayout,
  renderItem,
  enableRowSelection: enableRowSelectionProp,
  onSelectionChange,
  dropdownFilters,
  bulkActions,
  rowActions,
  translations,
}: DataTableProps<T>) {
  const enableRowSelection =
    enableRowSelectionProp ?? (bulkActions !== undefined && bulkActions.length > 0);

  // Container-scoped narrow detection: the table adapts to the panel it was
  // given, not the viewport. Unmeasured (first paint, jsdom) counts as wide so
  // the table layout is the default.
  const { ref: containerRef, width: containerWidth } = useContainerWidth<HTMLDivElement>();
  const isNarrowContainer = containerWidth !== undefined && containerWidth < narrowContainerWidth;

  const resolvedTranslations: Required<DataTableTranslations> = useMemo(
    () => ({ ...defaultTranslations, ...translations }),
    [translations],
  );

  const {
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    layout,
    setLayout,
    dropdownFilterValues,
    setDropdownFilterValue,
    clearSelection,
  } = useDataTableState({
    defaultLayout: defaultLayout ?? layouts?.[0] ?? "table",
    enableRowSelection,
  });

  const [localSortingState, setLocalSortingState] = useState<SortingState>([]);

  const isServerPagination = serverPageCount !== undefined;
  const isServerSorting = serverSortingState !== undefined;
  const isSortable = sorting || isServerSorting;

  // Apply dropdown filter predicates to data
  const filteredByDropdown = useMemo(() => {
    if (!dropdownFilters) {
      return data;
    }
    const activeFilters = dropdownFilters.filter(
      (f) => dropdownFilterValues[f.id] && dropdownFilterValues[f.id] !== "",
    );
    if (activeFilters.length === 0) {
      return data;
    }
    return data.filter((row) =>
      activeFilters.every((f) => f.predicate(row, dropdownFilterValues[f.id])),
    );
  }, [data, dropdownFilters, dropdownFilterValues]);

  // Build TanStack columns, prepend selection column, append actions column
  const tanstackColumns = useMemo(() => {
    const cols = toTanStackColumns(columns, isSortable);
    const result: TanStackColumnDef<T, unknown>[] = [];

    if (enableRowSelection) {
      result.push({
        id: "__select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
      });
    }

    result.push(...cols);

    if (rowActions) {
      result.push({
        id: "__actions",
        header: "",
        cell: ({ row }) => {
          const actions = typeof rowActions === "function" ? rowActions(row.original) : rowActions;
          return <DataTableRowActions row={row.original} actions={actions} />;
        },
        enableSorting: false,
        meta: { align: "right" },
      });
    }

    return result;
  }, [columns, isSortable, enableRowSelection, rowActions]);

  // Build table state
  const state: Record<string, unknown> = {};
  if (isServerSorting) {
    state.sorting = serverSortingState;
  } else if (isSortable) {
    state.sorting = localSortingState;
  }
  if (isServerPagination && paginationState) {
    state.pagination = paginationState;
  }
  if (enableRowSelection) {
    state.rowSelection = rowSelection;
  }
  if (searchable) {
    state.globalFilter = globalFilter;
  }

  const table = useReactTable({
    data: filteredByDropdown,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    state,

    ...(isSortable &&
      !isServerSorting && {
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setLocalSortingState,
      }),
    ...(isServerSorting && {
      manualSorting: true,
      onSortingChange: serverOnSortingChange,
    }),
    ...(pagination &&
      !isServerPagination && {
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: pagination.pageSize } },
      }),
    ...(isServerPagination && {
      manualPagination: true,
      pageCount: serverPageCount,
      onPaginationChange,
    }),

    // Search / filtering (global only — dropdown filters are applied pre-table)
    ...(searchable && {
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "includesString",
    }),

    // Row selection
    ...(enableRowSelection && {
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
    }),
  });

  // Notify consumer of selection changes
  useEffect(() => {
    if (!onSelectionChange) {
      return;
    }
    const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
    onSelectionChange(selectedRows);
  }, [rowSelection, onSelectionChange, table]);

  const cardRenderer = renderItem ?? mobileRenderItem;

  // Auto-detect layouts when a card renderer is available
  const effectiveLayouts =
    layouts ?? (cardRenderer ? (["table", "list", "grid"] as const) : undefined);

  const hasToolbar =
    searchable ||
    (dropdownFilters && dropdownFilters.length > 0) ||
    (effectiveLayouts && effectiveLayouts.length > 1) ||
    (enableRowSelection && bulkActions && bulkActions.length > 0);

  const selectedCount = Object.keys(rowSelection).length;

  // Narrow containers always use cards when a card renderer is provided.
  const showNarrowCards = isNarrowContainer && mobileRenderItem;
  const effectiveLayout = showNarrowCards ? "list" : layout;

  // Pagination bar
  const paginationBar = (isServerPagination || pagination) && (
    <PaginationBarEl>
      <PaginationInfoEl>
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </PaginationInfoEl>
      <Div layout="row" gap="sm">
        <PaginationButtonEl
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </PaginationButtonEl>
        <PaginationButtonEl onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </PaginationButtonEl>
      </Div>
    </PaginationBarEl>
  );

  // Card list rendering (for mobile cards, list layout, or grid layout)
  const renderCardList = (isGrid: boolean) => {
    const rows = table.getRowModel().rows;
    const renderer = cardRenderer;
    if (!renderer) {
      return null;
    }

    const cardLayout = isGrid ? ("grid" as const) : ("list" as const);

    if (rows.length === 0) {
      return <Div padding="md">{EmptyComponent ?? "No results."}</Div>;
    }

    return (
      <div className="@container">
        <div className={dataTableCardListVariants({ layout: cardLayout })}>
          {rows.map((row) => {
            const card = renderer(row.original);
            if (onRowClick) {
              return (
                <div
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  className={dataTableCardVariants({ layout: cardLayout, clickable: true })}
                  onClick={() => onRowClick(row.original)}
                  onKeyDown={(e: KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onRowClick(row.original);
                    }
                  }}
                >
                  {card}
                </div>
              );
            }
            return (
              <div key={row.id} className={dataTableCardVariants({ layout: cardLayout })}>
                {card}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Table rendering
  const renderTable = () => (
    <TableScrollContainerEl>
      <TableEl>
        <TheadEl>
          {table.getHeaderGroups().map((headerGroup) => (
            <TrEl key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const align = getColumnAlign(header.column.columnDef.meta);
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <ThEl
                    key={header.id}
                    align={align}
                    sortable={canSort || undefined}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {canSort && <SortIndicator direction={sortDir} />}
                  </ThEl>
                );
              })}
            </TrEl>
          ))}
        </TheadEl>
        <TbodyEl>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TrEl
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                clickable={onRowClick ? true : undefined}
                severity={getRowSeverity ? getRowSeverity(row.original) : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const align = getColumnAlign(cell.column.columnDef.meta);
                  return (
                    <TdEl key={cell.id} align={align}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TdEl>
                  );
                })}
              </TrEl>
            ))
          ) : (
            <TrEl>
              <TdEl colSpan={tanstackColumns.length} empty>
                {EmptyComponent ?? "No results."}
              </TdEl>
            </TrEl>
          )}
        </TbodyEl>
      </TableEl>
    </TableScrollContainerEl>
  );

  // Determine what to render based on effective layout
  let content: ReactNode;
  if (effectiveLayout === "grid" && cardRenderer) {
    content = renderCardList(true);
  } else if (effectiveLayout === "list" && cardRenderer) {
    content = renderCardList(false);
  } else {
    content = renderTable();
  }

  return (
    <TableDataWrapperEl ref={containerRef}>
      {hasToolbar && (
        <DataTableToolbar
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          dropdownFilters={dropdownFilters}
          dropdownFilterValues={dropdownFilterValues}
          onDropdownFilterChange={setDropdownFilterValue}
          layouts={effectiveLayouts}
          currentLayout={layout}
          onLayoutChange={setLayout}
          narrow={isNarrowContainer}
          selectedCount={selectedCount}
          selectedRows={table.getSelectedRowModel().rows.map((r) => r.original)}
          bulkActions={bulkActions}
          onClearSelection={clearSelection}
          translations={resolvedTranslations}
        />
      )}
      {content}
      {paginationBar}
    </TableDataWrapperEl>
  );
}
