import * as React from "react";
import { ChevronDown, Search, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ScrollArea } from "../scrollArea";
import { OptionGroup } from "./optionItem";
import { comboboxTriggerVariants, comboboxContentVariants } from "./variants";
import type { ComboboxOption, ComboboxGroup, ComboboxProps } from "./types";

export type { ComboboxOption, ComboboxGroup, ComboboxProps };
export * from "./variants";

// --- Helpers ---

function isGrouped(items: ComboboxOption[] | ComboboxGroup[]): items is ComboboxGroup[] {
  return items.length > 0 && "options" in items[0];
}

function normalizeToGroups(items: ComboboxOption[] | ComboboxGroup[]): ComboboxGroup[] {
  if (items.length === 0) {
    return [];
  }
  if (isGrouped(items)) {
    return items;
  }
  return [{ label: "", options: items as ComboboxOption[] }];
}

function findOption(groups: ComboboxGroup[], value: string): ComboboxOption | undefined {
  for (const group of groups) {
    const found = group.options.find((o) => o.value === value);
    if (found) {
      return found;
    }
  }
  return undefined;
}

function filterGroups(groups: ComboboxGroup[], query: string): ComboboxGroup[] {
  const lower = query.toLowerCase();
  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter(
        (o) =>
          o.label.toLowerCase().includes(lower) ||
          (o.description?.toLowerCase().includes(lower) ?? false),
      ),
    }))
    .filter((group) => group.options.length > 0);
}

// --- Component ---

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    onValueChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    disabled = false,
    clearable = false,
    width = "full",
    id,
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  const groups = React.useMemo(() => normalizeToGroups(options), [options]);
  const filtered = React.useMemo(
    () => (search ? filterGroups(groups, search) : groups),
    [groups, search],
  );
  const selected = value ? findOption(groups, value) : undefined;

  const handleSelect = React.useCallback(
    (optionValue: string) => {
      if (optionValue === value) {
        setOpen(false);
        return;
      }
      onValueChange?.(optionValue);
      setOpen(false);
      setSearch("");
    },
    [onValueChange, value],
  );

  const handleClear = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      onValueChange?.(undefined);
    },
    [onValueChange],
  );

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch("");
        }
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={comboboxTriggerVariants({ width })}
        >
          {selected ? (
            <span className="flex min-w-0 items-center gap-2">
              {selected.icon && <span className="flex shrink-0 items-center">{selected.icon}</span>}
              <span className="truncate">{selected.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <span className="flex shrink-0 items-center gap-1">
            {clearable && selected && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e);
                  }
                }}
                className="rounded-sm opacity-50 hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </span>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={comboboxContentVariants()}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            searchRef.current?.focus();
          }}
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <ScrollArea className="max-h-[min(300px,var(--radix-popover-content-available-height))]">
            <div className="p-1">
              {filtered.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
              )}
              {filtered.map((group, gi) => (
                <OptionGroup
                  key={group.label || gi}
                  group={group}
                  selectedValue={value}
                  onSelect={handleSelect}
                  showLabel={isGrouped(options)}
                />
              ))}
            </div>
          </ScrollArea>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});

export { Combobox };
