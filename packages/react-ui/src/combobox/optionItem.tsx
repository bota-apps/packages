import { Check } from "lucide-react";
import { comboboxOptionVariants } from "./variants";
import type { ComboboxOption, ComboboxGroup } from "./types";

// --- Option Item ---

type OptionItemProps = {
  option: ComboboxOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
};

export function OptionItem({ option, isSelected, onSelect }: OptionItemProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      tabIndex={-1}
      onClick={() => {
        if (!option.disabled) {
          onSelect(option.value);
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !option.disabled) {
          e.preventDefault();
          onSelect(option.value);
        }
      }}
      className={comboboxOptionVariants({ disabled: option.disabled, selected: isSelected })}
    >
      {/* Icon */}
      {option.icon && <span className="flex shrink-0 items-center">{option.icon}</span>}

      {/* Label + description */}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{option.label}</span>
        {option.description && (
          <span className="truncate text-xs text-muted-foreground">{option.description}</span>
        )}
      </span>

      {/* Check mark */}
      {isSelected && <Check className="ml-auto h-4 w-4 shrink-0" />}
    </div>
  );
}

// --- Option Group ---

type OptionGroupProps = {
  group: ComboboxGroup;
  selectedValue?: string;
  onSelect: (value: string) => void;
  showLabel: boolean;
};

export function OptionGroup({ group, selectedValue, onSelect, showLabel }: OptionGroupProps) {
  return (
    <div role="group" aria-label={group.label || undefined}>
      {showLabel && group.label && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group.label}</div>
      )}
      {group.options.map((option) => (
        <OptionItem
          key={option.value}
          option={option}
          isSelected={option.value === selectedValue}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
