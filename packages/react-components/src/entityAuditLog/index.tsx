import { useState } from "react";
import { ChevronRight, History } from "lucide-react";
import {
  Badge,
  Button,
  DateTime,
  EmptyState,
  ErrorState,
  Inline,
  List,
  Loading,
  Stack,
  Text,
} from "@bota-apps/react-ui";
import {
  defaultFormatAuditAction,
  type AuditEntryConstraint,
  type FormatAuditAction,
} from "./types";

export { AuditEntryDetail, type AuditEntryDetailTranslations } from "./detail";
export { FieldValue } from "./fieldValue";
export {
  defaultFormatAuditAction,
  type AuditActionPresentation,
  type AuditChangeConstraint,
  type AuditEntryConstraint,
  type FormatAuditAction,
} from "./types";

export type EntityAuditLogTranslations = {
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  previous?: string;
  next?: string;
  pageLabel?: string;
};

export type EntityAuditLogProps<TEntry extends AuditEntryConstraint> = {
  /** The current page's entries — data-injected; the component fetches nothing. */
  entries: readonly TEntry[] | undefined;
  page: number;
  pageCount?: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onEntryClick?: (entry: TEntry) => void;
  /** Maps API action codes to label + badge tone (default: humanized English). */
  formatAction?: FormatAuditAction;
  translations?: EntityAuditLogTranslations;
};

function summarize(entry: AuditEntryConstraint, actionLabel: string): string {
  const labels = entry.changes.map((change) => change.label);
  if (labels.length === 0) {
    return actionLabel;
  }
  if (labels.length === 1) {
    return labels[0];
  }
  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }
  return `${labels[0]}, ${labels[1]} and ${labels.length - 2} more`;
}

/**
 * Paginated audit-history list for one entity. Generic over the API-owned
 * entry type: pass the rows straight from the API (any type satisfying the
 * structural constraint) and receive the same type back in `onEntryClick`.
 */
export function EntityAuditLog<TEntry extends AuditEntryConstraint>({
  entries,
  page,
  pageCount,
  onPageChange,
  isLoading,
  isError,
  onEntryClick,
  formatAction = defaultFormatAuditAction,
  translations,
}: EntityAuditLogProps<TEntry>) {
  const t = {
    emptyTitle: translations?.emptyTitle ?? "No audit entries",
    emptyDescription:
      translations?.emptyDescription ?? "Changes will appear here once they are recorded.",
    errorTitle: translations?.errorTitle ?? "Failed to load audit log",
    previous: translations?.previous ?? "Previous",
    next: translations?.next ?? "Next",
    pageLabel: translations?.pageLabel ?? "Page",
  };

  if (isError) {
    return <ErrorState title={t.errorTitle} description="" />;
  }
  if (isLoading && !entries) {
    return <Loading />;
  }

  const rows = entries ?? [];
  if (rows.length === 0) {
    return <EmptyState icon={<History />} title={t.emptyTitle} description={t.emptyDescription} />;
  }

  const totalPages = pageCount ?? 1;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <Stack gap="md">
      <List
        data={[...rows]}
        keyExtractor={(entry) => entry.id}
        variant="divided"
        onItemClick={onEntryClick}
        renderItem={(entry) => {
          const action = formatAction(entry.action);
          return (
            <Inline gap="md" justify="between" align="center">
              <Stack gap="xs">
                <Inline gap="sm" align="center" wrap>
                  <Badge variant={action.variant}>{action.label}</Badge>
                  <Text size="md" weight="medium">
                    {summarize(entry, action.label)}
                  </Text>
                </Inline>
                <Inline gap="sm" align="center" wrap>
                  <Text size="sm" tone="muted">
                    {entry.actor.name}
                  </Text>
                  <Text size="sm" tone="muted">
                    ·
                  </Text>
                  <Text size="sm" tone="muted">
                    <DateTime variant="relative" value={entry.occurredAt} />
                  </Text>
                  {entry.note ? (
                    <>
                      <Text size="sm" tone="muted">
                        ·
                      </Text>
                      <Text size="sm" tone="muted" truncate>
                        {entry.note}
                      </Text>
                    </>
                  ) : null}
                </Inline>
              </Stack>
              {onEntryClick ? (
                <Text tone="muted">
                  <ChevronRight />
                </Text>
              ) : null}
            </Inline>
          );
        }}
      />
      {totalPages > 1 ? (
        <Inline gap="md" justify="between" align="center">
          <Text size="sm" tone="muted">
            {t.pageLabel} {page} / {totalPages}
          </Text>
          <Inline gap="sm">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrev}
              onClick={() => onPageChange(page - 1)}
            >
              {t.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canNext}
              onClick={() => onPageChange(page + 1)}
            >
              {t.next}
            </Button>
          </Inline>
        </Inline>
      ) : null}
    </Stack>
  );
}

/** Page state for the audit log — pairs with the query the app drives. */
export function useEntityAuditLogPagination(initialPageSize = 20) {
  const [page, setPage] = useState(1);
  return { page, setPage, pageSize: initialPageSize };
}
