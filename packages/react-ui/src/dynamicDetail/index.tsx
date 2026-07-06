import { useMemo, type ReactNode } from "react";
import type {
  TypedDetailSchema,
  TypedDetailFieldSchema,
  FormSection,
  Money,
} from "@bota-apps/types";
import { Card } from "../card";
import { Grid, Stack, Inline } from "../layout";
import { Text } from "../typography";
import { DetailField } from "../detailField";
import { PhoneDisplay } from "../phoneDisplay";
import { CurrencyText } from "../currencyText";
import { NumericText } from "../numericText";

type DynamicDetailVariant = "card" | "flat" | "inline";

type DynamicDetailProps<T extends Record<string, unknown>> = {
  schema: TypedDetailSchema<T>;
  data: T;
  columns?: 1 | 2;
  /** Layout variant: "card" (default) wraps sections in cards, "flat" renders fields in a grid without cards, "inline" renders key-value pairs horizontally */
  variant?: DynamicDetailVariant;
};

export function DynamicDetail<T extends Record<string, unknown>>({
  schema,
  data,
  columns = 2,
  variant = "card",
}: DynamicDetailProps<T>) {
  const sections = useMemo(() => groupFieldsBySection(schema), [schema]);

  if (variant === "inline") {
    return <InlineDetail sections={sections} data={data} />;
  }

  if (variant === "flat") {
    return <FlatDetail sections={sections} data={data} columns={columns} />;
  }

  // Card variant: smart single-section — use full width when only 1 section
  const effectiveColumns = sections.length === 1 ? 1 : columns;

  return (
    <Grid gap="lg" columns={effectiveColumns}>
      {sections.map((section) => (
        <SectionFields key={section.key} section={section} data={data} />
      ))}
    </Grid>
  );
}

/** Card variant — each section wrapped in a Card */
function SectionFields<T extends Record<string, unknown>>({
  section,
  data,
}: {
  section: FieldGroup<T>;
  data: T;
}) {
  return (
    <Card title={section.title}>
      <Stack gap="md">
        {section.fields.map((field) => {
          const value = formatValue(data[field.name], field);
          if (value === undefined) {
            return null;
          }
          const copyValue = field.copyable ? String(data[field.name] ?? "") : undefined;
          return (
            <DetailField
              key={field.name}
              label={field.label}
              value={value}
              copyable={field.copyable}
              copyValue={copyValue}
            />
          );
        })}
      </Stack>
    </Card>
  );
}

/** Flat variant — fields in a responsive grid, no card wrappers */
function FlatDetail<T extends Record<string, unknown>>({
  sections,
  data,
  columns,
}: {
  sections: FieldGroup<T>[];
  data: T;
  columns: 1 | 2;
}) {
  return (
    <Stack gap="lg">
      {sections.map((section) => (
        <Stack key={section.key} gap="md">
          {section.title && (
            <Text size="sm" weight="medium" tone="muted">
              {section.title}
            </Text>
          )}
          <Grid gap="md" columns={section.columns ?? columns}>
            {section.fields.map((field) => {
              const value = formatValue(data[field.name], field);
              if (value === undefined) {
                return null;
              }
              const copyValue = field.copyable ? String(data[field.name] ?? "") : undefined;
              return (
                <DetailField
                  key={field.name}
                  label={field.label}
                  value={value}
                  copyable={field.copyable}
                  copyValue={copyValue}
                />
              );
            })}
          </Grid>
        </Stack>
      ))}
    </Stack>
  );
}

/** Inline variant — horizontal key-value pairs, compact summary strip */
function InlineDetail<T extends Record<string, unknown>>({
  sections,
  data,
}: {
  sections: FieldGroup<T>[];
  data: T;
}) {
  const allFields = sections.flatMap((s) => s.fields);

  return (
    <Inline gap="lg" wrap>
      {allFields.map((field) => {
        const value = formatValue(data[field.name], field);
        if (value === undefined) {
          return null;
        }
        return (
          <Stack key={field.name} gap="xs">
            <Text size="sm" weight="medium" tone="muted">
              {field.label}
            </Text>
            <Text size="sm">{value}</Text>
          </Stack>
        );
      })}
    </Inline>
  );
}

function formatValue<T extends Record<string, unknown>>(
  raw: unknown,
  field: TypedDetailFieldSchema<T>,
): ReactNode {
  if (raw === undefined || raw === null || raw === "") {
    return undefined;
  }

  if (field.options) {
    const option = field.options.find((o) => o.value === String(raw));
    if (option) {
      return option.label;
    }
  }

  switch (field.type) {
    case "currency": {
      return <CurrencyText value={raw as Money} format="short" size="sm" tone="default" />;
    }
    case "number": {
      return (
        <NumericText
          value={typeof raw === "number" ? raw : Number(raw)}
          variant="count"
          size="sm"
        />
      );
    }
    case "phone": {
      return <PhoneDisplay phone={String(raw)} showCallButton size="md" />;
    }
    case "checkbox":
    case "switch": {
      return raw ? "Yes" : "No";
    }
    default: {
      return String(raw);
    }
  }
}

type FieldGroup<T extends Record<string, unknown>> = {
  key: string;
  title?: string;
  columns?: 1 | 2 | 3;
  fields: TypedDetailFieldSchema<T>[];
};

function groupFieldsBySection<T extends Record<string, unknown>>(
  schema: TypedDetailSchema<T>,
): FieldGroup<T>[] {
  const sectionMap = new Map<string, FieldGroup<T>>();

  for (const field of schema.fields) {
    const sectionKey = field.section ?? "__default__";

    if (!sectionMap.has(sectionKey)) {
      const sectionMeta = schema.sections?.find((s: FormSection) => s.key === sectionKey);
      sectionMap.set(sectionKey, {
        key: sectionKey,
        title: sectionMeta?.title,
        columns: sectionMeta?.columns as 1 | 2 | 3 | undefined,
        fields: [],
      });
    }

    sectionMap.get(sectionKey)!.fields.push(field);
  }

  return Array.from(sectionMap.values());
}
