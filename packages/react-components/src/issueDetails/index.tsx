import { useId, useState } from "react";
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
import { ScreenshotGallery } from "./screenshotGallery";

export type IssueDetailsTranslations = {
  descriptionHeading: string;
  reproStepsHeading: string;
  /** Heading for the machine-captured diagnostics attached at filing time. */
  technicalContextHeading: string;
  screenshotsHeading: string;
  /** Accessible label for a screenshot thumbnail opening the full-size preview. */
  previewScreenshotLabel: (fileName: string) => string;
  /** Accessible label for the preview dialog close button. */
  closePreviewLabel: string;
  previousScreenshotLabel: string;
  nextScreenshotLabel: string;
  /** "n of m" readout while paging through the screenshots. */
  screenshotPositionLabel: (position: number, total: number) => string;
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
  previewScreenshotLabel: (fileName) => `Preview ${fileName}`,
  closePreviewLabel: "Close",
  previousScreenshotLabel: "Previous",
  nextScreenshotLabel: "Next",
  screenshotPositionLabel: (position, total) => `${position} of ${total}`,
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
  // Per-key merge: an optional translator handing over explicitly-undefined
  // keys must not clobber the defaults.
  const t: IssueDetailsTranslations = {
    descriptionHeading: translations?.descriptionHeading ?? defaultTranslations.descriptionHeading,
    reproStepsHeading: translations?.reproStepsHeading ?? defaultTranslations.reproStepsHeading,
    technicalContextHeading:
      translations?.technicalContextHeading ?? defaultTranslations.technicalContextHeading,
    screenshotsHeading: translations?.screenshotsHeading ?? defaultTranslations.screenshotsHeading,
    previewScreenshotLabel:
      translations?.previewScreenshotLabel ?? defaultTranslations.previewScreenshotLabel,
    closePreviewLabel: translations?.closePreviewLabel ?? defaultTranslations.closePreviewLabel,
    previousScreenshotLabel:
      translations?.previousScreenshotLabel ?? defaultTranslations.previousScreenshotLabel,
    nextScreenshotLabel:
      translations?.nextScreenshotLabel ?? defaultTranslations.nextScreenshotLabel,
    screenshotPositionLabel:
      translations?.screenshotPositionLabel ?? defaultTranslations.screenshotPositionLabel,
    contactHeading: translations?.contactHeading ?? defaultTranslations.contactHeading,
    createdLabel: translations?.createdLabel ?? defaultTranslations.createdLabel,
    updatedLabel: translations?.updatedLabel ?? defaultTranslations.updatedLabel,
    statusLabel: translations?.statusLabel ?? defaultTranslations.statusLabel,
    statusPlaceholder: translations?.statusPlaceholder ?? defaultTranslations.statusPlaceholder,
    updatingStatus: translations?.updatingStatus ?? defaultTranslations.updatingStatus,
  };
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
          <ScreenshotGallery
            screenshots={screenshots}
            previewLabel={t.previewScreenshotLabel}
            closeLabel={t.closePreviewLabel}
            previousLabel={t.previousScreenshotLabel}
            nextLabel={t.nextScreenshotLabel}
            positionLabel={t.screenshotPositionLabel}
          />
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
