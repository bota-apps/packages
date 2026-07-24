import { Bell } from "lucide-react";
import {
  Badge,
  Button,
  type ButtonProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
  VisuallyHidden,
} from "@bota-apps/react-ui";

export type NotificationsMenuItem = {
  id: string;
  title: string;
  description?: string;
  /** Pre-formatted time label (e.g. "2h ago") — formatting is app data. */
  timeLabel?: string;
  read?: boolean;
};

type NotificationsMenuProps = {
  /** Newest first — the menu renders them in the order given. */
  items: readonly NotificationsMenuItem[];
  /** Accessible name for the icon-only bell trigger. */
  label?: string;
  headingLabel?: string;
  emptyLabel?: string;
  markAllReadLabel?: string;
  /** Shown when present and any item is unread. */
  onMarkAllRead?: () => void;
  /** Selection handler — navigation (and read-marking) is app policy. */
  onItemSelect?: (item: NotificationsMenuItem) => void;
  /** Trigger button variant — pass "chrome" when mounted on the shell chrome. */
  variant?: ButtonProps["variant"];
};

/**
 * Header bell with an unread-count badge opening a notification list. Purely
 * presentational: the app supplies the items (already fetched and formatted)
 * and decides what selecting or clearing them means — the menu carries no
 * data-layer or routing coupling.
 */
export function NotificationsMenu({
  items,
  label = "Notifications",
  headingLabel = "Notifications",
  emptyLabel = "You're all caught up",
  markAllReadLabel = "Mark all as read",
  onMarkAllRead,
  onItemSelect,
  variant = "outline",
}: NotificationsMenuProps) {
  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="relative">
          <Bell />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              size="count"
              className="absolute -right-1.5 -top-1.5"
              aria-hidden
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <VisuallyHidden>
            {unreadCount > 0 ? `${label} (${unreadCount} unread)` : label}
          </VisuallyHidden>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between gap-2 pr-1">
          <DropdownMenuLabel>{headingLabel}</DropdownMenuLabel>
          {onMarkAllRead && unreadCount > 0 && (
            <Button
              variant="action"
              size="auto"
              className="text-xs"
              onClick={(event) => {
                // Keep the menu open — clearing is not a selection.
                event.stopPropagation();
                onMarkAllRead();
              }}
            >
              {markAllReadLabel}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <Text as="div" size="sm" tone="muted" className="px-2 py-6 text-center">
            {emptyLabel}
          </Text>
        ) : (
          <DropdownMenuGroup className="max-h-96 overflow-y-auto">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="items-start gap-3 py-2"
                onSelect={() => onItemSelect?.(item)}
              >
                {/* Unread dot column keeps read/unread rows aligned. */}
                <span
                  aria-hidden
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${
                    item.read ? "bg-transparent" : "bg-primary"
                  }`}
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-baseline justify-between gap-2">
                    <Text
                      as="span"
                      size="sm"
                      weight={item.read ? "normal" : "semibold"}
                      className="min-w-0 truncate"
                    >
                      {item.title}
                    </Text>
                    {item.timeLabel && (
                      <Text as="span" tone="muted" className="shrink-0 text-xs">
                        {item.timeLabel}
                      </Text>
                    )}
                  </span>
                  {item.description && (
                    <Text as="span" tone="muted" lineClamp={2} className="text-xs">
                      {item.description}
                    </Text>
                  )}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
