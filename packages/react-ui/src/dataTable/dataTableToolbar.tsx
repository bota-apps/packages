import type { DropdownFilter, BulkAction, DataTableLayout, DataTableTranslations } from "./types";
import { Search, LayoutGrid, LayoutList, Table2, X } from "lucide-react";
import { InputEl } from "../html/input";
import { Button } from "../button";
import { ToggleGroup, ToggleGroupItem } from "../toggleGroup";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../select";
import { useBreakpoint } from "../lib/useBreakpoint";

type DataTableToolbarProps<T> = {
  searchable?: boolean;
  searchPlaceholder?: string;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;

  dropdownFilters?: DropdownFilter<T>[];
  dropdownFilterValues: Record<string, string>;
  onDropdownFilterChange: (id: string, value: string) => void;

  layouts?: readonly DataTableLayout[];
  currentLayout: DataTableLayout;
  onLayoutChange: (layout: DataTableLayout) => void;

  // Bulk bar (inline in toolbar when rows selected)
  selectedCount: number;
  selectedRows: T[];
  bulkActions?: BulkAction<T>[];
  onClearSelection: () => void;

  translations: Required<DataTableTranslations>;
};

const layoutIcons: Record<DataTableLayout, typeof Table2> = {
  table: Table2,
  list: LayoutList,
  grid: LayoutGrid,
};

export function DataTableToolbar<T>({
  searchable,
  searchPlaceholder = "Search...",
  globalFilter,
  onGlobalFilterChange,
  dropdownFilters,
  dropdownFilterValues,
  onDropdownFilterChange,
  layouts,
  currentLayout,
  onLayoutChange,
  selectedCount,
  selectedRows,
  bulkActions,
  onClearSelection,
  translations: tt,
}: DataTableToolbarProps<T>) {
  const bp = useBreakpoint();
  const hasSearch = searchable;
  const hasDropdownFilters = dropdownFilters && dropdownFilters.length > 0;
  const hasLayouts = layouts && layouts.length > 1;
  const hasBulkActions = bulkActions && bulkActions.length > 0;
  const showBulkBar = selectedCount > 0 && hasBulkActions;

  if (!hasSearch && !hasDropdownFilters && !hasLayouts && !showBulkBar) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b px-2 py-2 md:px-4 md:py-3">
      {showBulkBar ? (
        <>
          <span className="text-sm font-medium">
            {tt.selected.replace("{{count}}", String(selectedCount))}
          </span>
          <div className="flex items-center gap-1">
            {bulkActions!.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant === "destructive" ? "destructive" : "outline"}
                size="sm"
                onClick={() => action.onAction(selectedRows)}
              >
                {action.icon && <action.icon className="mr-1.5 h-3.5 w-3.5" />}
                {action.label}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="mr-1 h-3.5 w-3.5" />
            {tt.clear}
          </Button>
        </>
      ) : (
        <>
          {hasSearch && (
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <InputEl
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => onGlobalFilterChange(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          )}

          {hasDropdownFilters &&
            dropdownFilters.map((filter) => (
              <Select
                key={filter.id}
                value={dropdownFilterValues[filter.id] ?? ""}
                onValueChange={(value) =>
                  onDropdownFilterChange(filter.id, value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger className="h-8 w-auto min-w-[120px] max-w-[180px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{tt.all}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
        </>
      )}

      <div className="ml-auto flex items-center gap-2">
        {hasLayouts && bp.above("md") && (
          <ToggleGroup
            type="single"
            value={currentLayout}
            onValueChange={(val) => {
              if (val) {
                onLayoutChange(val as DataTableLayout);
              }
            }}
            size="sm"
          >
            {layouts.map((l) => {
              const Icon = layoutIcons[l];
              return (
                <ToggleGroupItem key={l} value={l} aria-label={`${l} view`}>
                  <Icon className="h-4 w-4" />
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        )}
      </div>
    </div>
  );
}
