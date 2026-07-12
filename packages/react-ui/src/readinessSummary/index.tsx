/**
 * ReadinessSummary — a "what's left before this is ready" panel: an optional
 * progress bar with a worded count, then grouped, actionable issues. Generalizes
 * the readiness/completeness panels found across products (setup checklists,
 * document completeness, pre-submission validation …).
 *
 * Router-neutral: issues expose an `onSelect` callback and/or a trailing action
 * node — no routing lives here (an app or the react-components layer wires links).
 * Readiness is never communicated by color alone: the header states the count in
 * words, each issue has a shape icon, and a positive zero-state renders when
 * nothing is outstanding.
 */
import type { ReactNode } from "react";
import { CircleAlert, CircleCheckBig, Info, TriangleAlert } from "lucide-react";
import { Div, Li, Span, Ul } from "../html";
import { Text } from "../html/typography";
import { Progress } from "../progress";
import { cn } from "../lib/utils";
import {
  readinessIssueIconVariants,
  readinessIssueVariants,
  readinessSummaryVariants,
  type ReadinessSeverity,
} from "./variants";

export * from "./variants";

export type ReadinessIssue = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Defaults to `error`. */
  severity?: ReadinessSeverity;
  /** When provided, the issue becomes a keyboard-operable button. */
  onSelect?: () => void;
  /** Trailing content (a count badge, a custom link/action node). */
  action?: ReactNode;
};

export type ReadinessGroup = {
  id: string;
  title?: ReactNode;
  issues: readonly ReadinessIssue[];
};

export type ReadinessProgress = {
  complete: number;
  total: number;
};

export type ReadinessSummaryProps = {
  groups: readonly ReadinessGroup[];
  title?: ReactNode;
  /** Drives the progress bar and its "{complete} of {total}" caption. */
  progress?: ReadinessProgress;
  /** Rendered when every group is empty. Defaults to a positive English state. */
  readyState?: ReactNode;
  /**
   * Formats the completeness caption beside the title. Defaults to English
   * "{complete} of {total} complete".
   */
  progressLabel?: (complete: number, total: number) => ReactNode;
  ariaLabel?: string;
};

function severityIcon(severity: ReadinessSeverity): ReactNode {
  if (severity === "warning") {
    return <TriangleAlert aria-hidden />;
  }
  if (severity === "info") {
    return <Info aria-hidden />;
  }
  return <CircleAlert aria-hidden />;
}

function IssueRow({ issue }: { issue: ReadinessIssue }) {
  const severity = issue.severity ?? "error";
  const body = (
    <>
      <Span className={cn(readinessIssueIconVariants({ severity }))}>{severityIcon(severity)}</Span>
      <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text as="span" size="sm" weight="medium" tone="default" className="min-w-0">
          {issue.label}
        </Text>
        {issue.description !== undefined && (
          <Text as="span" size="sm" tone="muted">
            {issue.description}
          </Text>
        )}
      </Div>
      {issue.action !== undefined && <Span className="shrink-0">{issue.action}</Span>}
    </>
  );

  if (issue.onSelect !== undefined) {
    const onSelect = issue.onSelect;
    return (
      <button
        type="button"
        onClick={() => onSelect()}
        className={cn(readinessIssueVariants({ interactive: true }))}
      >
        {body}
      </button>
    );
  }
  return <Div className={cn(readinessIssueVariants())}>{body}</Div>;
}

export function ReadinessSummary({
  groups,
  title,
  progress,
  readyState,
  progressLabel,
  ariaLabel,
}: ReadinessSummaryProps) {
  const issueCount = groups.reduce((sum, group) => sum + group.issues.length, 0);
  const ready = issueCount === 0;
  const pct =
    progress !== undefined && progress.total > 0
      ? Math.round((progress.complete / progress.total) * 100)
      : undefined;

  return (
    <Div className={cn(readinessSummaryVariants())} aria-label={ariaLabel} role="group">
      {(title !== undefined || progress !== undefined) && (
        <Div className="flex flex-col gap-2">
          <Div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            {title !== undefined && (
              <Text as="h3" size="md" weight="semibold" tone="default">
                {title}
              </Text>
            )}
            {progress !== undefined && (
              <Text as="span" size="sm" tone="muted">
                {progressLabel
                  ? progressLabel(progress.complete, progress.total)
                  : `${progress.complete} of ${progress.total} complete`}
              </Text>
            )}
          </Div>
          {pct !== undefined && <Progress value={pct} />}
        </Div>
      )}

      {ready ? (
        <Div className="flex items-center gap-2">
          <Span className="shrink-0 text-emerald-600 dark:text-emerald-400 [&_svg]:size-4">
            <CircleCheckBig aria-hidden />
          </Span>
          <Text as="span" size="sm" tone="default">
            {readyState ?? "Everything looks ready."}
          </Text>
        </Div>
      ) : (
        <Div className="flex flex-col gap-4">
          {groups
            .filter((group) => group.issues.length > 0)
            .map((group) => (
              <Div key={group.id} className="flex flex-col gap-1">
                {group.title !== undefined && (
                  <Text as="h4" size="sm" weight="medium" tone="muted">
                    {group.title}
                  </Text>
                )}
                <Ul className="flex flex-col">
                  {group.issues.map((issue) => (
                    <Li key={issue.id}>
                      <IssueRow issue={issue} />
                    </Li>
                  ))}
                </Ul>
              </Div>
            ))}
        </Div>
      )}
    </Div>
  );
}
