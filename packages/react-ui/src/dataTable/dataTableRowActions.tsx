import { MoreHorizontal } from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../dropdownMenu";
import type { RowAction } from "./types";

type DataTableRowActionsProps<T> = {
  row: T;
  actions: RowAction<T>[];
};

export function DataTableRowActions<T>({ row, actions }: DataTableRowActionsProps<T>) {
  if (actions.length === 0) {
    return null;
  }

  // The menu lives inside the row, and React synthetic events bubble up the
  // React tree even out of the portalled menu content — without these guards,
  // opening the menu or clicking an item also fires the row's onRowClick
  // (e.g. navigating away mid-action). Mirrors the selection checkbox cell.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {actions.map((action, idx) => {
          if ("type" in action) {
            return <DropdownMenuSeparator key={idx} />;
          }
          return (
            <DropdownMenuItem
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                action.onAction(row);
              }}
              className={action.variant === "destructive" ? "text-destructive" : undefined}
            >
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
