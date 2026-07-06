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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, idx) => {
          if ("type" in action) {
            return <DropdownMenuSeparator key={idx} />;
          }
          return (
            <DropdownMenuItem
              key={idx}
              onClick={() => action.onAction(row)}
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
