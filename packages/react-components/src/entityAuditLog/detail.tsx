import type { ReactNode } from "react";
import {
  Badge,
  Card,
  DateTime,
  Grid,
  Heading,
  Inline,
  List,
  Stack,
  Text,
} from "@bota-apps/react-ui";
import { FieldValue } from "./fieldValue";
import {
  defaultFormatAuditAction,
  type AuditChangeConstraint,
  type AuditEntryConstraint,
  type FormatAuditAction,
} from "./types";

export type AuditEntryDetailTranslations = {
  changes?: string;
  when?: string;
  who?: string;
  role?: string;
  source?: string;
  before?: string;
  after?: string;
  fieldsChanged?: string;
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function MetaCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap="xs">
      <Text size="sm" tone="muted" weight="medium">
        {label.toUpperCase()}
      </Text>
      {children}
    </Stack>
  );
}

function ChangeRow({
  change,
  beforeLabel,
  afterLabel,
}: {
  change: AuditChangeConstraint;
  beforeLabel: string;
  afterLabel: string;
}) {
  return (
    <Stack gap="sm">
      <Text size="sm" weight="medium">
        {change.label}
      </Text>
      <Grid columns={2} gap="sm">
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            {beforeLabel}
          </Text>
          <FieldValue value={change.before} valueType={change.valueType} size="md" tone="muted" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            {afterLabel}
          </Text>
          <FieldValue value={change.after} valueType={change.valueType} size="md" />
        </Stack>
      </Grid>
    </Stack>
  );
}

type AuditEntryDetailProps<TEntry extends AuditEntryConstraint> = {
  entry: TEntry;
  formatAction?: FormatAuditAction;
  translations?: AuditEntryDetailTranslations;
};

/** Full-page/drawer view of one audit entry: headline, metadata, and before/after changes. */
export function AuditEntryDetail<TEntry extends AuditEntryConstraint>({
  entry,
  formatAction = defaultFormatAuditAction,
  translations,
}: AuditEntryDetailProps<TEntry>) {
  const t = {
    changes: translations?.changes ?? "Changes",
    when: translations?.when ?? "When",
    who: translations?.who ?? "Actor",
    role: translations?.role ?? "Role",
    source: translations?.source ?? "Source",
    before: translations?.before ?? "Before",
    after: translations?.after ?? "After",
    fieldsChanged: translations?.fieldsChanged ?? "fields changed",
  };
  const action = formatAction(entry.action);

  const headline =
    entry.changes.length === 1
      ? entry.changes[0].label
      : entry.changes.length > 1
        ? `${entry.changes.length} ${t.fieldsChanged}`
        : action.label;

  return (
    <Stack gap="lg">
      <Card>
        <Stack gap="md">
          <Inline gap="sm" align="center" wrap>
            <Badge variant={action.variant}>{action.label}</Badge>
            <Text size="sm" tone="muted">
              <DateTime variant="relative" value={entry.occurredAt} />
            </Text>
          </Inline>
          <Heading as="h2" size="lg">
            {headline}
          </Heading>
          <Inline gap="sm" align="center">
            <Badge variant="muted">{initials(entry.actor.name) || "?"}</Badge>
            <Stack gap="xs">
              <Text size="md" weight="medium">
                {entry.actor.name}
              </Text>
              {entry.actor.role ? (
                <Text size="sm" tone="muted">
                  {entry.actor.role}
                </Text>
              ) : null}
            </Stack>
          </Inline>
          {entry.note ? (
            <Text size="md" tone="muted">
              “{entry.note}”
            </Text>
          ) : null}
        </Stack>
      </Card>

      <Card>
        <Grid columns={2} gap="md">
          <MetaCell label={t.when}>
            <Stack gap="xs">
              <DateTime variant="datetime" value={entry.occurredAt} />
              <Text size="sm" tone="muted">
                <DateTime variant="relative" value={entry.occurredAt} />
              </Text>
            </Stack>
          </MetaCell>
          <MetaCell label={t.source}>
            {entry.source ? (
              <Badge variant="muted">{entry.source}</Badge>
            ) : (
              <Text tone="muted">—</Text>
            )}
          </MetaCell>
          <MetaCell label={t.who}>
            <Text>{entry.actor.name}</Text>
          </MetaCell>
          <MetaCell label={t.role}>
            {entry.actor.role ? <Text>{entry.actor.role}</Text> : <Text tone="muted">—</Text>}
          </MetaCell>
        </Grid>
      </Card>

      {entry.changes.length > 0 ? (
        <Card>
          <Stack gap="md">
            <Heading as="h3" size="md">
              {t.changes}
            </Heading>
            <List
              data={[...entry.changes]}
              keyExtractor={(change) => change.field}
              variant="divided"
              renderItem={(change) => (
                <ChangeRow change={change} beforeLabel={t.before} afterLabel={t.after} />
              )}
            />
          </Stack>
        </Card>
      ) : null}
    </Stack>
  );
}
