import { Fragment } from "react";
import type { LucideIcon } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../dropdownMenu";
import { pageMenuActionItemVariants } from "./variants";

export * from "./variants";

export type PageMenuActionVariant = "default" | "destructive";

export type PageMenuAction = {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: PageMenuActionVariant;
  disabled?: boolean;
  hidden?: boolean;
  children?: PageMenuAction[];
};

type PageMenuActionsProps = {
  actions: PageMenuAction[];
};

export function PageMenuActions({ actions }: PageMenuActionsProps) {
  const visible = actions.filter((a) => !a.hidden);
  if (visible.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visible.map((action, i) => {
          const prevAction = visible[i - 1];
          const needsSeparator =
            action.variant === "destructive" && prevAction?.variant !== "destructive";

          if (action.children && action.children.length > 0) {
            const Icon = action.icon;
            return (
              <Fragment key={action.label}>
                {needsSeparator && <DropdownMenuSeparator />}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={action.disabled}>
                    {Icon && <Icon />}
                    {action.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {action.children
                      .filter((c) => !c.hidden)
                      .map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <DropdownMenuItem
                            key={child.label}
                            onSelect={child.onClick}
                            disabled={child.disabled}
                          >
                            {ChildIcon && <ChildIcon />}
                            {child.label}
                          </DropdownMenuItem>
                        );
                      })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </Fragment>
            );
          }

          const Icon = action.icon;
          return (
            <Fragment key={action.label}>
              {needsSeparator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={action.onClick}
                disabled={action.disabled}
                className={pageMenuActionItemVariants({ variant: action.variant })}
              >
                {Icon && <Icon />}
                {action.label}
              </DropdownMenuItem>
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
