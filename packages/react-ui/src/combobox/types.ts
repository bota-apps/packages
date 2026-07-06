import type { ReactNode } from "react";

export type ComboboxOption = {
  /** Unique value used for selection */
  value: string;
  /** Primary display text */
  label: string;
  /** Secondary description shown below the label */
  description?: string;
  /** Icon or avatar shown to the left of the label */
  icon?: ReactNode;
  /** Whether this option is disabled */
  disabled?: boolean;
};

export type ComboboxGroup = {
  /** Group heading label */
  label: string;
  /** Options within this group */
  options: ComboboxOption[];
};

export type ComboboxProps = {
  /** Flat list of options or grouped options */
  options: ComboboxOption[] | ComboboxGroup[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Callback when selection changes */
  onValueChange?: (value: string | undefined) => void;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Message shown when no options match the search */
  emptyMessage?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Whether the selection can be cleared */
  clearable?: boolean;
  /** Width behavior */
  width?: "full" | "auto";
  /** HTML id for the trigger */
  id?: string;
};
