/**
 * NotificationsPanel — the notification list as a docked SidePanel (the
 * roomier sibling of NotificationsMenu's dropdown), plus the matching
 * NotificationsTrigger bell for the shell header. Purely presentational:
 * the app supplies the items (already fetched and formatted) and decides
 * what selecting or clearing them means.
 */
import { Bell } from "lucide-react";
import {
  Badge,
  Button,
  type ButtonProps,
  SidePanel,
  Text,
  VisuallyHidden,
  cn,
} from "@bota-apps/react-ui";
import type { NotificationsMenuItem } from "../notificationsMenu";

export type NotificationsTriggerProps = {
  /** Number badged on the bell (0 hides the badge). */
  unreadCount: number;
  /** Accessible name for the icon-only bell. */
  label?: string;
  /** Trigger button variant — pass "chrome" when mounted on the shell chrome. */
  variant?: ButtonProps["variant"];
  /** Reflects the target panel's open state (exposed as `aria-pressed`). */
  active?: boolean;
  onClick?: () => void;
};

/** Header bell that toggles a NotificationsPanel (or any notifications surface). */
export function NotificationsTrigger({
  unreadCount,
  label = "Notifications",
  variant = "outline",
  active = false,
  onClick,
}: NotificationsTriggerProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      className="relative"
      aria-pressed={active}
      onClick={onClick}
    >
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
  );
}

export type NotificationsPanelProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Newest first — the panel renders them in the order given. */
  items: readonly NotificationsMenuItem[];
  title?: string;
  description?: string;
  emptyLabel?: string;
  markAllReadLabel?: string;
  /** Shown when present and any item is unread. */
  onMarkAllRead?: () => void;
  /** Selection handler — navigation (and read-marking) is app policy. */
  onItemSelect?: (item: NotificationsMenuItem) => void;
  closeLabel?: string;
  widenLabel?: string;
  narrowLabel?: string;
};

export function NotificationsPanel({
  open,
  onOpenChange,
  items,
  title = "Notifications",
  description,
  emptyLabel = "You're all caught up",
  markAllReadLabel = "Mark all as read",
  onMarkAllRead,
  onItemSelect,
  closeLabel,
  widenLabel,
  narrowLabel,
}: NotificationsPanelProps) {
  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      closeLabel={closeLabel}
      widenLabel={widenLabel}
      narrowLabel={narrowLabel}
    >
      <div className="flex flex-col gap-2">
        {onMarkAllRead && unreadCount > 0 && (
          <div className="flex justify-end">
            <Button variant="action" size="auto" className="text-xs" onClick={onMarkAllRead}>
              {markAllReadLabel}
            </Button>
          </div>
        )}
        {items.length === 0 ? (
          <Text as="div" size="sm" tone="muted" className="px-2 py-10 text-center">
            {emptyLabel}
          </Text>
        ) : (
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onItemSelect?.(item)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  {/* Unread dot column keeps read/unread rows aligned. */}
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      item.read ? "bg-transparent" : "bg-primary",
                    )}
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
                      <Text as="span" size="sm" tone="muted" lineClamp={3}>
                        {item.description}
                      </Text>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SidePanel>
  );
}
