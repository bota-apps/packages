import { Fragment, type ReactNode } from "react";
import { Div, SectionEl, SectionHeader, Stack } from "@bota-apps/react-ui";
import { lifecyclePageSectionBodyVariants, lifecyclePageSectionVariants } from "./variants";

export * from "./variants";

export type LifecyclePageSectionProps = {
  /** Section heading. Also the section's accessible name when `ariaLabel` is absent. */
  title?: string;
  /** Supporting copy shown under the title. */
  description?: string;
  /** The pre-configured process-timeline node. */
  timeline: ReactNode;
  /** Optional status-legend node, shown under the header. */
  legend?: ReactNode;
  /** Optional supporting action (button/link) shown in the header. */
  action?: ReactNode;
  /** Optional detail panel — sits beside the timeline in wide containers, stacks in narrow. */
  details?: ReactNode;
  /** Explicit accessible name; falls back to `title`. */
  ariaLabel?: string;
};

/**
 * LifecyclePageSection — a slot-based composition that frames a process
 * timeline with a section header, an optional status legend, an optional
 * header action, and an optional detail panel.
 *
 * The caller passes already-configured react-ui nodes (`ProcessTimeline`,
 * `StatusLegend`, an action control, a detail panel); this component owns only
 * the landmark, the header, and the responsive layout.
 *
 * Layout is container-scoped: the section is its own `@container`, and the
 * timeline/detail split reacts to the section's width rather than the viewport.
 * Nothing here animates, so the frame holds a stable position as slot content
 * changes.
 */
export function LifecyclePageSection({
  title,
  description,
  timeline,
  legend,
  action,
  details,
  ariaLabel,
}: LifecyclePageSectionProps) {
  const accessibleName = ariaLabel ?? title;
  const hasDetails = details !== undefined;

  return (
    <SectionEl aria-label={accessibleName} className={lifecyclePageSectionVariants()}>
      <Stack gap="md">
        {title !== undefined && (
          <SectionHeader
            title={title}
            description={description}
            actions={
              action !== undefined ? [<Fragment key="action">{action}</Fragment>] : undefined
            }
          />
        )}
        {legend !== undefined && <Div>{legend}</Div>}
        <Div
          className={lifecyclePageSectionBodyVariants({ layout: hasDetails ? "split" : "single" })}
        >
          <Div>{timeline}</Div>
          {hasDetails && <Div>{details}</Div>}
        </Div>
      </Stack>
    </SectionEl>
  );
}
