import { Inbox, Image as ImageIcon } from "lucide-react";
import {
  Badge,
  DateTime,
  EmptyState,
  Inline,
  Skeleton,
  Stack,
  Text,
  cn,
} from "@bota-apps/react-ui";
import {
  defaultIssueStatusAppearance,
  issueDateValue,
  type Issue,
  type IssueStatusAppearance,
} from "../issueReporter/types";

export type IssueListTranslations = {
  emptyTitle: string;
  emptyDescription: string;
  /** Unit appended to the screenshot count for its accessible name. */
  screenshotsLabel: string;
};

const defaultTranslations: IssueListTranslations = {
  emptyTitle: "No issues reported",
  emptyDescription: "Reported issues will show up here.",
  screenshotsLabel: "screenshots",
};

export type IssueListProps<TIssue extends Issue = Issue> = {
  issues: readonly TIssue[];
  /** Rows render as buttons when provided; receives the host's issue type back. */
  onSelect?: (issue: TIssue) => void;
  selectedIssueId?: string;
  /** Maps a feature id to its display label. Default: the id itself. */
  featureLabel?: (featureId: string) => string;
  /** Per-status presentation; missing statuses fall back to the default mapping. */
  statusAppearance?: Record<string, IssueStatusAppearance>;
  /** Renders skeleton rows instead of content. */
  loading?: boolean;
  translations?: Partial<IssueListTranslations>;
};

/** Compact, selectable list of reported issues. Purely presentational. */
export function IssueList<TIssue extends Issue = Issue>({
  issues,
  onSelect,
  selectedIssueId,
  featureLabel = (featureId) => featureId,
  statusAppearance,
  loading = false,
  translations,
}: IssueListProps<TIssue>) {
  const t = { ...defaultTranslations, ...translations };

  if (loading) {
    return (
      <Stack gap="sm" aria-busy="true">
        {[0, 1, 2].map((row) => (
          <Skeleton key={row} className="h-16 w-full" />
        ))}
      </Stack>
    );
  }

  if (issues.length === 0) {
    return <EmptyState icon={<Inbox />} title={t.emptyTitle} description={t.emptyDescription} />;
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {issues.map((issue) => {
        const appearance =
          statusAppearance?.[issue.status] ?? defaultIssueStatusAppearance(issue.status);
        const selected = issue.id === selectedIssueId;
        const screenshotCount = issue.screenshots?.length ?? 0;
        const row = (
          <Inline gap="md" justify="between" align="start" className="w-full">
            <Stack gap="xs" grow className="text-left">
              <Inline gap="sm" align="center" wrap>
                <Badge variant={appearance.variant}>{appearance.label}</Badge>
                <Text size="sm" weight="medium" as="span">
                  {featureLabel(issue.featureId)}
                </Text>
              </Inline>
              <Text size="sm" tone="muted" truncate as="span" className="block max-w-full">
                {issue.description}
              </Text>
            </Stack>
            <Stack gap="xs" align="end" shrink="0">
              <DateTime variant="relative" value={issueDateValue(issue.createdAt)} tone="muted" />
              {screenshotCount > 0 && (
                <Inline
                  gap="xs"
                  align="center"
                  aria-label={`${screenshotCount} ${t.screenshotsLabel}`}
                  className="text-muted-foreground"
                >
                  <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <Text size="sm" as="span">
                    {screenshotCount}
                  </Text>
                </Inline>
              )}
            </Stack>
          </Inline>
        );
        return (
          <li key={issue.id}>
            {onSelect !== undefined ? (
              <button
                type="button"
                onClick={() => onSelect(issue)}
                aria-current={selected || undefined}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "bg-accent",
                )}
              >
                {row}
              </button>
            ) : (
              <div className="px-4 py-3">{row}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
