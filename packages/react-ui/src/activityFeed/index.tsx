/**
 * ActivityFeed — a human-readable, chronological feed of things that happened
 * (records logged, statuses changed, documents uploaded, approvals granted).
 * Deliberately distinct from a compliance audit log: it favors readability over
 * exact provenance. Pair it with a dedicated audit surface where exact history
 * is required.
 *
 * Domain-neutral: callers supply entries with a tone, an optional icon, and
 * arbitrary title/description nodes. Semantic `<ol>` markup with a connecting
 * rail; a zero-state renders when there is nothing to show.
 */
import type { ReactNode } from "react";
import { Div, Li, Ol, Span } from "../html";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import {
  activityFeedDotVariants,
  activityFeedItemVariants,
  activityFeedMarkerVariants,
  activityFeedVariants,
  type ActivityFeedDensity,
  type ActivityFeedTone,
} from "./variants";

export * from "./variants";

export type ActivityFeedItem = {
  id: string;
  /** What happened — accepts nodes (e.g. an actor name plus an action). */
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  /** Marker icon; a solid dot renders when omitted. */
  icon?: ReactNode;
  tone?: ActivityFeedTone;
};

export type ActivityFeedProps = {
  items: readonly ActivityFeedItem[];
  density?: ActivityFeedDensity;
  /** Draw the connecting rail between entries. Defaults to `true`. */
  showConnectors?: boolean;
  ariaLabel?: string;
  /** Shown when `items` is empty. Defaults to a quiet English message. */
  emptyState?: ReactNode;
};

export function ActivityFeed({
  items,
  density = "comfortable",
  showConnectors = true,
  ariaLabel,
  emptyState,
}: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <Text as="p" size="sm" tone="muted">
        {emptyState ?? "No activity yet."}
      </Text>
    );
  }

  return (
    <Ol aria-label={ariaLabel} className={cn(activityFeedVariants())}>
      {items.map((item) => {
        const tone = item.tone ?? "default";
        return (
          <Li
            key={item.id}
            className={cn(
              activityFeedItemVariants({ density }),
              !showConnectors && "before:hidden",
            )}
          >
            <Span className={cn(activityFeedMarkerVariants({ tone, density }))}>
              {item.icon ?? <Span className={cn(activityFeedDotVariants({ tone }))} />}
            </Span>
            <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <Text as="span" size="sm" tone="default" className="min-w-0">
                  {item.title}
                </Text>
                {item.timestamp !== undefined && (
                  <Span className="shrink-0 text-xs text-muted-foreground">{item.timestamp}</Span>
                )}
              </Div>
              {item.description !== undefined && (
                <Text as="div" size="sm" tone="muted">
                  {item.description}
                </Text>
              )}
            </Div>
          </Li>
        );
      })}
    </Ol>
  );
}
