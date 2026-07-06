import { MoreHorizontal } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "@bota-apps/react-ui";
import { Link } from "@tanstack/react-router";
import type { BreadcrumbItem } from "./types";

type OverflowCrumbProps = {
  hidden: BreadcrumbItem[];
};

/** The "…" crumb — collapsed middle items behind a dropdown. */
export function OverflowCrumb({ hidden }: OverflowCrumbProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Show hidden breadcrumbs">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {hidden.map((item, i) => (
          <DropdownMenuItem key={`${item.label}-${i}`} asChild>
            {item.to ? (
              <Link to={item.to}>
                <Text as="span" size="sm">
                  {item.label}
                </Text>
              </Link>
            ) : (
              <Text as="span" size="sm">
                {item.label}
              </Text>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
