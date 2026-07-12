/**
 * Timeline — vertical event list: a rail of markers (dot or icon chip)
 * connected by a line, one entry per event.
 *
 * Compound API: `Timeline` renders the <ol> wrapper, `TimelineItem` renders
 * each <li>. The connector is the item's ::before pseudo-element, running
 * from below the marker to the bottom of the row; `last:before:hidden`
 * removes it on the final entry so the rail ends at the last marker.
 *
 * Markers are tone-tinted chips (soft surface + strong dot / icon color);
 * the primary tone uses the `selected` interaction tokens so rebrands
 * inherit it from the primary ramp.
 */
import type { ReactNode } from "react";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import {
  timelineDotVariants,
  timelineItemVariants,
  timelineMarkerVariants,
  timelineMetaVariants,
  timelineVariants,
  type TimelineTone,
} from "./variants";

export * from "./variants";

export type TimelineProps = {
  children: ReactNode;
};

export function Timeline({ children }: TimelineProps) {
  return <ol className={cn(timelineVariants())}>{children}</ol>;
}

export type TimelineItemProps = {
  title: ReactNode;
  /** Timestamp or other secondary meta, rendered beside the title. */
  meta?: ReactNode;
  description?: ReactNode;
  /** Icon rendered inside the marker chip; a solid dot renders when omitted. */
  icon?: ReactNode;
  /** Colors the marker chip and dot/icon. */
  tone?: TimelineTone;
  /** Extra content below the description (badges, links, attachments …). */
  children?: ReactNode;
};

export function TimelineItem({
  title,
  meta,
  description,
  icon,
  tone = "default",
  children,
}: TimelineItemProps) {
  return (
    <li className={cn(timelineItemVariants())}>
      <span className={cn(timelineMarkerVariants({ tone }))}>
        {icon ?? <span className={cn(timelineDotVariants({ tone }))} />}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Wraps so the meta drops under the title in narrow containers
            instead of pushing the row wider than the timeline. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <Text as="span" size="sm" weight="medium" tone="default" className="min-w-0">
            {title}
          </Text>
          {meta !== undefined && <span className={timelineMetaVariants()}>{meta}</span>}
        </div>
        {description !== undefined && (
          <Text as="div" size="sm" tone="muted">
            {description}
          </Text>
        )}
        {children}
      </div>
    </li>
  );
}
