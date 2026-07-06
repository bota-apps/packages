import { useState, useCallback, useEffect } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import type { DataTableLayout } from "./types";

type UseDataTableStateOptions = {
  defaultLayout?: DataTableLayout;
  enableRowSelection?: boolean;
  onSelectionChange?: (indices: RowSelectionState) => void;
};

export function useDataTableState(options: UseDataTableStateOptions = {}) {
  const { defaultLayout = "table", enableRowSelection = false } = options;

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [layout, setLayout] = useState<DataTableLayout>(defaultLayout);
  const [dropdownFilterValues, setDropdownFilterValues] = useState<Record<string, string>>({});

  const setDropdownFilterValue = useCallback((id: string, value: string) => {
    setDropdownFilterValues((prev) => {
      if (value === "") {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: value };
    });
  }, []);

  const clearDropdownFilters = useCallback(() => {
    setDropdownFilterValues({});
  }, []);

  const clearSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  // Reset selection when enableRowSelection is turned off
  useEffect(() => {
    if (!enableRowSelection) {
      setRowSelection({});
    }
  }, [enableRowSelection]);

  return {
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    layout,
    setLayout,
    dropdownFilterValues,
    setDropdownFilterValue,
    clearDropdownFilters,
    clearSelection,
  };
}
