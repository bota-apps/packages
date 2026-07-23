import { Fragment, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ButtonEl } from "../html/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdownMenu";
import {
  splitButtonContentVariants,
  splitButtonItemBodyVariants,
  splitButtonItemDescriptionVariants,
  splitButtonItemVariants,
  splitButtonPrimaryVariants,
  splitButtonTriggerVariants,
  splitButtonVariants,
} from "./variants";

export * from "./variants";

export type SplitButtonVariant = "default" | "secondary" | "destructive" | "outline";
export type SplitButtonSize = "default" | "sm" | "lg";

export type SplitButtonItem = {
  id: string;
  label: string;
  /** Optional second line rendered muted under the label. */
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  hidden?: boolean;
  /** Draw a separator above this item to start a new group. */
  separatorBefore?: boolean;
  onSelect: () => void;
};

export type SplitButtonProps = {
  /** Primary segment content — icon + label as children, like Button. */
  children: ReactNode;
  /** Primary segment activation. */
  onClick: () => void;
  /**
   * Accessible name for the chevron segment — what screen readers announce
   * and tests query by role. Required so the trigger is never anonymous.
   */
  menuLabel: string;
  items: SplitButtonItem[];
  variant?: SplitButtonVariant;
  size?: SplitButtonSize;
  /** Disables both segments. */
  disabled?: boolean;
  fullWidth?: boolean;
  /** Menu alignment relative to the control. */
  align?: "start" | "end";
};

/**
 * A primary action with attached secondary choices. The two segments render
 * as one control; when every item is hidden the chevron disappears and only
 * the primary button remains.
 */
export function SplitButton({
  children,
  onClick,
  menuLabel,
  items,
  variant = "default",
  size = "default",
  disabled = false,
  fullWidth = false,
  align = "end",
}: SplitButtonProps) {
  const visible = items.filter((item) => !item.hidden);

  if (visible.length === 0) {
    return (
      <ButtonEl
        type="button"
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </ButtonEl>
    );
  }

  return (
    <span className={splitButtonVariants({ fullWidth })}>
      <ButtonEl
        type="button"
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={onClick}
        className={splitButtonPrimaryVariants({ fullWidth })}
      >
        {children}
      </ButtonEl>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonEl
            type="button"
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={menuLabel}
            className={splitButtonTriggerVariants({ variant })}
          >
            <ChevronDown aria-hidden="true" />
          </ButtonEl>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className={splitButtonContentVariants()}>
          {visible.map((item) => {
            const Icon = item.icon;
            return (
              <Fragment key={item.id}>
                {item.separatorBefore && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  disabled={item.disabled}
                  onSelect={() => item.onSelect()}
                  className={splitButtonItemVariants({ twoLine: item.description !== undefined })}
                >
                  {Icon && <Icon aria-hidden="true" />}
                  {item.description === undefined ? (
                    item.label
                  ) : (
                    <span className={splitButtonItemBodyVariants()}>
                      <span>{item.label}</span>
                      <span className={splitButtonItemDescriptionVariants()}>
                        {item.description}
                      </span>
                    </span>
                  )}
                </DropdownMenuItem>
              </Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}
