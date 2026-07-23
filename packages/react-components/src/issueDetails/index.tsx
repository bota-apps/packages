import { useId, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import {
  Badge,
  Combobox,
  DateTime,
  Heading,
  Inline,
  Label,
  Stack,
  Text,
} from "@bota-apps/react-ui";
import {
  defaultIssueStatusAppearance,
  issueDateValue,
  type Issue,
  type IssueStatusAppearance,
} from "../issueReporter/types";

export type IssueDetailsTranslations = {
  descriptionHeading: string;
  reproStepsHeading: string;
  /** Heading for the machine-captured diagnostics attached at filing time. */
  technicalContextHeading: string;
  screenshotsHeading: string;
  contactHeading: string;
  createdLabel: string;
  updatedLabel: string;
  statusLabel: string;
  statusPlaceholder: string;
  updatingStatus: string;
};

const defaultTranslations: IssueDetailsTranslations = {
  descriptionHeading: "Description",
  reproStepsHeading: "Steps to reproduce",
  technicalContextHeading: "Technical details",
  screenshotsHeading: "Screenshots",
  contactHeading: "Reported by",
  createdLabel: "Created",
  updatedLabel: "Updated",
  statusLabel: "Status",
  statusPlaceholder: "Select a status",
  updatingStatus: "Updating status...",
};

export type IssueDetailsProps<TIssue extends Issue = Issue> = {
  issue: TIssue;
  /** Maps a feature id to its display label. Default: the id itself. */
  featureLabel?: (featureId: string) => string;
  /** Per-status presentation; missing statuses fall back to the default mapping. */
  statusAppearance?: Record<string, IssueStatusAppearance>;
  /** Together with `onUpdateStatus`, enables the status editing control. */
  statusOptions?: readonly { value: string; label: string }[];
  /** Called with the newly chosen status; a returned promise drives the pending state. */
  onUpdateStatus?: (status: string) => void | Promise<void>;
  translations?: Partial<IssueDetailsTranslations>;
};

/** Read-only view of one reported issue, with optional status editing. */
export function IssueDetails<TIssue extends Issue = Issue>({
  issue,
  featureLabel = (featureId) => featureId,
  statusAppearance,
  statusOptions,
  onUpdateStatus,
  translations,
}: IssueDetailsProps<TIssue>) {
  const t = { ...defaultTranslations, ...translations };
  const statusFieldId = useId();
  // The status being written by the host right now, if any — shown as the
  // interim selection and released when the handler's promise settles.
  const [pendingStatus, setPendingStatus] = useState<string | undefined>(undefined);

  const appearance = statusAppearance?.[issue.status] ?? defaultIssueStatusAppearance(issue.status);
  const screenshots = issue.screenshots ?? [];
  const reproSteps = issue.reproSteps ?? undefined;
  const technicalContext = issue.technicalContext ?? undefined;
  const hasContact =
    (issue.contactName ?? undefined) !== undefined ||
    (issue.contactEmail ?? undefined) !== undefined;
  const canEditStatus = statusOptions !== undefined && onUpdateStatus !== undefined;

  const handleStatusChange = (next: string | undefined) => {
    if (next === undefined || next === issue.status || onUpdateStatus === undefined) {
      return;
    }
    const result = onUpdateStatus(next);
    if (result instanceof Promise) {
      setPendingStatus(next);
      void result
        .catch(() => undefined) // surfacing errors is the host's concern
        .finally(() => setPendingStatus(undefined));
    }
  };

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Inline gap="sm" align="center" wrap>
          <Heading as="h2" size="md">
            {featureLabel(issue.featureId)}
          </Heading>
          <Badge variant={appearance.variant}>{appearance.label}</Badge>
        </Inline>
        <Inline gap="sm" align="center" wrap>
          <Text size="sm" tone="muted" as="span">
            {t.createdLabel} <DateTime variant="datetime" value={issueDateValue(issue.createdAt)} />
          </Text>
          {issue.updatedAt != null && (
            <Text size="sm" tone="muted" as="span">
              {t.updatedLabel}{" "}
              <DateTime variant="datetime" value={issueDateValue(issue.updatedAt)} />
            </Text>
          )}
        </Inline>
      </Stack>

      <Stack gap="xs" as="section">
        <Heading as="h3" size="xs">
          {t.descriptionHeading}
        </Heading>
        <Text size="sm" className="whitespace-pre-wrap">
          {issue.description}
        </Text>
      </Stack>

      {reproSteps !== undefined && (
        <Stack gap="xs" as="section">
          <Heading as="h3" size="xs">
            {t.reproStepsHeading}
          </Heading>
          <Text size="sm" className="whitespace-pre-wrap">
            {reproSteps}
          </Text>
        </Stack>
      )}

      {technicalContext !== undefined && (
        <Stack gap="xs" as="section">
          <Heading as="h3" size="xs">
            {t.technicalContextHeading}
          </Heading>
          {/* Machine-captured payload — mono block, scrolls instead of blowing
              up the column width. */}
          <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap break-all">
            {technicalContext}
          </pre>
        </Stack>
      )}

      {screenshots.length > 0 && (
        <Stack gap="xs" as="section">
          <Heading as="h3" size="xs">
            {t.screenshotsHeading}
          </Heading>
          <Inline gap="sm" align="start" wrap>
            {screenshots.map((screenshot) =>
              screenshot.url !== undefined ? (
                <a
                  key={screenshot.id}
                  href={screenshot.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-md border border-border"
                >
                  <img
                    src={screenshot.url}
                    alt={screenshot.fileName}
                    className="h-24 w-24 object-cover"
                  />
                </a>
              ) : (
                <span
                  key={screenshot.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-sm text-muted-foreground"
                >
                  <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {screenshot.fileName}
                </span>
              ),
            )}
          </Inline>
        </Stack>
      )}

      {hasContact && (
        <Stack gap="xs" as="section">
          <Heading as="h3" size="xs">
            {t.contactHeading}
          </Heading>
          {issue.contactName != null && <Text size="sm">{issue.contactName}</Text>}
          {issue.contactEmail != null && (
            <Text size="sm" tone="muted">
              {issue.contactEmail}
            </Text>
          )}
        </Stack>
      )}

      {canEditStatus && (
        <Stack gap="xs" className="max-w-xs" as="section">
          <Label htmlFor={statusFieldId}>{t.statusLabel}</Label>
          <Combobox
            id={statusFieldId}
            options={statusOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            value={pendingStatus ?? issue.status}
            onValueChange={handleStatusChange}
            placeholder={t.statusPlaceholder}
            disabled={pendingStatus !== undefined}
          />
          {pendingStatus !== undefined && (
            <Text size="sm" tone="muted" role="status">
              {t.updatingStatus}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
}
