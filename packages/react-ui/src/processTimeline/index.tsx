/**
 * ProcessTimeline — a domain-neutral process-status component: an ordered set
 * of lifecycle steps, each `complete`, `current`, `upcoming`, `blocked`, or
 * `skipped`. It generalizes the app-local "how it works" / progress-tracker /
 * run-lifecycle markup found across products into one shared primitive.
 *
 * Data in via `items`, selection out via `onItemSelect` — the component fetches
 * nothing and knows no routes, statuses, or labels beyond the five generic
 * lifecycle positions. Callers map their own domain state to these.
 *
 * Accessibility:
 *   - semantic `<ol>` / `<li>` ordering
 *   - the current step carries `aria-current="step"`
 *   - status is never color-only: every marker has a default icon (shape) and
 *     each item a visually-hidden status label (overridable via `statusLabels`)
 *   - interactive items are real `<button>`s (keyboard-operable, `aria-pressed`)
 *
 * Responsive: the root is a `@container` scope. Vertical timelines are narrow-
 * friendly as-is; horizontal timelines hide per-step labels below `@2xl` and
 * show a compact "Step x of n" summary instead (mirrors Stepper).
 *
 * Motion: marker/connector color changes transition on the token duration and
 * collapse to instant under `prefers-reduced-motion`. No JS-driven animation.
 */
import type { ReactNode } from "react";
import { Ban, Check, Minus } from "lucide-react";
import { Div, Li, Ol, Span } from "../html";
import { Text } from "../html/typography";
import { cn } from "../lib/utils";
import {
  processTimelineConnectorVariants,
  processTimelineDotVariants,
  processTimelineListVariants,
  processTimelineMarkerVariants,
  processTimelineRowVariants,
  processTimelineVariants,
  processTimelineVerticalItemVariants,
  type ProcessTimelineDensity,
  type ProcessTimelineItemStatus,
  type ProcessTimelineOrientation,
} from "./variants";

export * from "./variants";

export type ProcessTimelineItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Extra context under the label (badges, source markers, counts …). */
  metadata?: ReactNode;
  /** Timestamp or other secondary meta, shown beside/under the label. */
  timestamp?: ReactNode;
  status: ProcessTimelineItemStatus;
  /** Overrides the status default marker icon. */
  icon?: ReactNode;
};

export type ProcessTimelineProps = {
  items: readonly ProcessTimelineItem[];
  orientation?: ProcessTimelineOrientation;
  density?: ProcessTimelineDensity;
  /** Draw connector lines between markers. Defaults to `true`. */
  showConnectors?: boolean;
  /** When provided, items become keyboard-operable buttons. */
  onItemSelect?: (id: string) => void;
  selectedItemId?: string;
  /** Accessible name for the list. */
  ariaLabel?: string;
  /** English by default; override to localize the visually-hidden status text. */
  statusLabels?: Partial<Record<ProcessTimelineItemStatus, string>>;
};

const defaultStatusLabels: Record<ProcessTimelineItemStatus, string> = {
  complete: "Complete",
  current: "Current",
  upcoming: "Upcoming",
  blocked: "Blocked",
  skipped: "Skipped",
};

/** Default marker glyph per status; `current`/`upcoming` fall back to a dot. */
function statusIcon(status: ProcessTimelineItemStatus): ReactNode {
  if (status === "complete") {
    return <Check aria-hidden />;
  }
  if (status === "blocked") {
    return <Ban aria-hidden />;
  }
  if (status === "skipped") {
    return <Minus aria-hidden />;
  }
  return undefined;
}

function Marker({ item, density }: { item: ProcessTimelineItem; density: ProcessTimelineDensity }) {
  const icon = item.icon ?? statusIcon(item.status);
  return (
    <Span className={cn(processTimelineMarkerVariants({ status: item.status, density }))}>
      {icon ?? (
        <Span className={cn(processTimelineDotVariants({ status: item.status, density }))} />
      )}
    </Span>
  );
}

export function ProcessTimeline({
  items,
  orientation = "vertical",
  density = "comfortable",
  showConnectors = true,
  onItemSelect,
  selectedItemId,
  ariaLabel,
  statusLabels,
}: ProcessTimelineProps) {
  const interactive = onItemSelect !== undefined;
  const labels = {
    complete: statusLabels?.complete ?? defaultStatusLabels.complete,
    current: statusLabels?.current ?? defaultStatusLabels.current,
    upcoming: statusLabels?.upcoming ?? defaultStatusLabels.upcoming,
    blocked: statusLabels?.blocked ?? defaultStatusLabels.blocked,
    skipped: statusLabels?.skipped ?? defaultStatusLabels.skipped,
  } satisfies Record<ProcessTimelineItemStatus, string>;

  const renderBody = (item: ProcessTimelineItem, align: "start" | "center") => (
    <Div className={cn("flex min-w-0 flex-col gap-1", align === "center" && "items-center")}>
      <Div
        className={cn(
          "flex flex-wrap items-baseline gap-x-3 gap-y-0.5",
          align === "center" ? "justify-center" : "justify-between",
        )}
      >
        <Text
          as="span"
          size="sm"
          weight="medium"
          tone="default"
          align={align === "center" ? "center" : "left"}
          className="min-w-0"
        >
          {item.label}
          <Span className="sr-only">{` — ${labels[item.status]}`}</Span>
        </Text>
        {item.timestamp !== undefined && (
          <Span className="shrink-0 text-xs text-muted-foreground">{item.timestamp}</Span>
        )}
      </Div>
      {item.description !== undefined && (
        <Text as="div" size="sm" tone="muted" align={align === "center" ? "center" : "left"}>
          {item.description}
        </Text>
      )}
      {item.metadata !== undefined && (
        <Div className={cn("text-xs text-muted-foreground", align === "center" && "text-center")}>
          {item.metadata}
        </Div>
      )}
    </Div>
  );

  // ---- Horizontal: Stepper-like row; labels collapse to a summary below @2xl.
  if (orientation === "horizontal") {
    const currentIndex = items.findIndex((item) => item.status === "current");
    const currentItem = currentIndex === -1 ? undefined : items[currentIndex];
    return (
      <Div className={cn(processTimelineVariants())}>
        <Ol aria-label={ariaLabel} className={cn(processTimelineListVariants({ orientation }))}>
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === items.length - 1;
            const selected = item.id === selectedItemId;
            const marker = <Marker item={item} density={density} />;
            return (
              <Li
                key={item.id}
                aria-current={item.status === "current" ? "step" : undefined}
                className="flex min-w-0 flex-1 flex-col items-center"
              >
                <Div className="flex w-full items-center gap-2">
                  {showConnectors && !isFirst ? (
                    <Span
                      aria-hidden="true"
                      className={cn(
                        processTimelineConnectorVariants({ status: items[index - 1].status }),
                      )}
                    />
                  ) : (
                    <Span aria-hidden="true" className="flex-1" />
                  )}
                  {interactive ? (
                    <button
                      type="button"
                      onClick={() => onItemSelect(item.id)}
                      aria-pressed={selected}
                      className={cn(
                        "shrink-0 rounded-full transition-transform duration-fast ease-standard hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 motion-reduce:transition-none motion-reduce:hover:scale-100",
                        selected && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background",
                      )}
                    >
                      {marker}
                    </button>
                  ) : (
                    <Span className="shrink-0">{marker}</Span>
                  )}
                  {showConnectors && !isLast ? (
                    <Span
                      aria-hidden="true"
                      className={cn(processTimelineConnectorVariants({ status: item.status }))}
                    />
                  ) : (
                    <Span aria-hidden="true" className="flex-1" />
                  )}
                </Div>
                <Div className="mt-2 hidden min-w-0 @2xl:flex">{renderBody(item, "center")}</Div>
              </Li>
            );
          })}
        </Ol>
        {currentItem !== undefined && (
          <Text size="sm" weight="medium" className="mt-2 @2xl:hidden">
            {`Step ${currentIndex + 1} of ${items.length} — `}
            {currentItem.label}
          </Text>
        )}
      </Div>
    );
  }

  // ---- Vertical: rail of markers with connectors; narrow-friendly by default.
  return (
    <Div className={cn(processTimelineVariants())}>
      <Ol aria-label={ariaLabel} className={cn(processTimelineListVariants({ orientation }))}>
        {items.map((item) => {
          const selected = item.id === selectedItemId;
          const row = (
            <>
              <Marker item={item} density={density} />
              {renderBody(item, "start")}
            </>
          );
          return (
            <Li
              key={item.id}
              aria-current={item.status === "current" ? "step" : undefined}
              className={cn(
                processTimelineVerticalItemVariants({
                  status: item.status,
                  density,
                }),
                !showConnectors && "before:hidden",
              )}
            >
              {interactive ? (
                <button
                  type="button"
                  onClick={() => onItemSelect(item.id)}
                  aria-pressed={selected}
                  className={cn(processTimelineRowVariants({ interactive: true, selected }))}
                >
                  {row}
                </button>
              ) : (
                <Div className={cn(processTimelineRowVariants())}>{row}</Div>
              )}
            </Li>
          );
        })}
      </Ol>
    </Div>
  );
}
