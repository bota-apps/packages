import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Inline, Stack } from "../html/layout";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import { listItemRowVariants } from "./variants";

export * from "./variants";

export type ListItemProps = {
  /** Leading slot — an avatar, icon, or status dot. */
  left?: ReactNode;
  title: string;
  description?: string;
  /** Extra content stacked under the title/description (badges, meta). */
  extra?: ReactNode;
  /** Trailing slot rendered before the optional arrow. */
  right?: ReactNode;
  /** Show a trailing chevron to signal the row navigates. */
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * A generic list row: leading slot + title/description/extra, with an optional
 * trailing slot and navigation chevron. Domain apps compose their own `*Item`
 * wrappers on top of this rather than re-implementing the layout.
 */
export function ListItem({
  left,
  title,
  description,
  extra,
  right,
  showArrow,
  onClick,
  className,
}: ListItemProps) {
  return (
    <Inline
      justify="between"
      gap="md"
      align="center"
      onClick={onClick}
      className={cn(listItemRowVariants({ clickable: onClick ? true : undefined }), className)}
    >
      <Inline gap="sm" align="center">
        {left}
        <Stack gap="none" align="start">
          <Text size="sm" weight="medium">
            {title}
          </Text>
          {description && (
            <Text size="sm" tone="muted">
              {description}
            </Text>
          )}
          {extra}
        </Stack>
      </Inline>
      {(right || showArrow) && (
        <Inline gap="sm" align="center">
          {right}
          {showArrow && (
            <Text tone="muted">
              <ChevronRight size={16} />
            </Text>
          )}
        </Inline>
      )}
    </Inline>
  );
}
