import { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import type {
  DynamicFieldSchema,
  RegistrationSchema,
  TypedRegistrationSchema,
} from "@bota-apps/types";
import type { FeatureBoundary } from "@bota-apps/types/fm";
import { buildFormZodSchema, buildDefaultValues } from "./zodBuilder";
import type { FormValidationMessages } from "./zodBuilder";
import { normalizeFormValues } from "./normalizer";
import { FieldRenderer, ComboboxOptionsProvider } from "./fieldRenderer";
import type { ComboboxOptionsMap } from "./fieldRenderer";
import { TabbedSections } from "./tabbedSections";
import { FormGrid, ButtonGroup } from "../formLayout";
import { Button } from "../button";
import { Stack, Inline } from "../layout";
import { Heading, Text } from "../typography";

/**
 * Internal structural type that both RegistrationSchema and TypedRegistrationSchema<T> satisfy.
 * Using readonly fields so TypedRegistrationSchema<T> (which has readonly fields) is assignable.
 */
type FormSchemaInput = {
  fields: readonly DynamicFieldSchema[];
  sections?: RegistrationSchema["sections"];
};

type DynamicFormProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  schema: TypedRegistrationSchema<T> | RegistrationSchema;
  onSubmit: (values: T) => void | Promise<unknown>;
  /**
   * Runs the submit under a pre-bound feature boundary — `scope.boundary({...})`
   * from fm — which owns error classification, success/error toasts, tracking, and
   * post-success reactions, so `onSubmit` can be the bare mutation. The contract
   * comes from @bota-apps/types/fm; react-ui never imports the fm runtime.
   */
  featureScope?: FeatureBoundary<unknown>;
  onCancel?: () => void;
  isPending?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  initialValues?: Partial<T>;
  /** Optional content rendered between field sections and submit buttons */
  children?: ReactNode;
  /** Form layout: "default" stacks all sections, "tabs" shows one section at a time via tab nav, "inline" renders fields horizontally (for filter bars) */
  layout?: "default" | "tabs" | "inline";
  /** Visual density: "default" for standard forms, "compact" for tighter spacing */
  size?: "default" | "compact";
  /** Runtime options for combobox fields, keyed by field name */
  comboboxOptions?: ComboboxOptionsMap;
  /** Override validation messages (e.g. for translation). Defaults are English. */
  validationMessages?: FormValidationMessages;
};

export function DynamicForm<T extends Record<string, unknown> = Record<string, unknown>>({
  schema,
  onSubmit,
  featureScope,
  onCancel,
  isPending,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  initialValues,
  children,
  layout = "default",
  size = "default",
  comboboxOptions = {},
  validationMessages,
}: DynamicFormProps<T>) {
  const formSchema: FormSchemaInput = schema;
  const zodSchema = useMemo(
    () => buildFormZodSchema(formSchema.fields, { messages: validationMessages }),
    [formSchema.fields, validationMessages],
  );
  const defaultValues = useMemo(
    () => ({
      ...buildDefaultValues(formSchema.fields),
      ...initialValues,
    }),
    [formSchema.fields, initialValues],
  );

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const normalized = normalizeFormValues<T>(values, formSchema.fields);
    if (featureScope) {
      await featureScope.run(async () => onSubmit(normalized));
    } else {
      await onSubmit(normalized);
    }
  });

  const sections = useMemo(() => groupFieldsBySection(formSchema), [formSchema]);

  if (layout === "inline") {
    return (
      <ComboboxOptionsProvider value={comboboxOptions}>
        <FormProvider {...form}>
          <Inline
            as="form"
            onSubmit={handleSubmit}
            gap={size === "compact" ? "sm" : "md"}
            wrap
            align="end"
          >
            {sections.flatMap((section) =>
              section.fields.map((field) => <FieldRenderer key={field.name} field={field} />),
            )}
            {children}
            <ButtonGroup>
              <Button
                type="submit"
                size={size === "compact" ? "sm" : "default"}
                disabled={isPending}
              >
                {isPending ? "..." : submitLabel}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size={size === "compact" ? "sm" : "default"}
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              )}
            </ButtonGroup>
          </Inline>
        </FormProvider>
      </ComboboxOptionsProvider>
    );
  }

  const useTabs = layout === "tabs" && sections.length >= 2 && sections.some((s) => s.title);
  const gap = size === "compact" ? "md" : "lg";

  return (
    <ComboboxOptionsProvider value={comboboxOptions}>
      <FormProvider {...form}>
        <Stack as="form" onSubmit={handleSubmit} gap={gap}>
          {useTabs ? (
            <TabbedSections sections={sections} />
          ) : (
            sections.map((section) => (
              <Stack key={section.key} gap={size === "compact" ? "sm" : "md"}>
                {section.title && (
                  <Heading as="h3" size="sm">
                    {section.title}
                  </Heading>
                )}
                {section.description && (
                  <Text tone="muted" size="sm">
                    {section.description}
                  </Text>
                )}
                <FormGrid>
                  {section.fields.map((field) => (
                    <FieldRenderer key={field.name} field={field} />
                  ))}
                </FormGrid>
              </Stack>
            ))
          )}

          {children}

          <ButtonGroup>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelLabel}
              </Button>
            )}
          </ButtonGroup>
        </Stack>
      </FormProvider>
    </ComboboxOptionsProvider>
  );
}

type FieldGroup = {
  key: string;
  title?: string;
  description?: string;
  fields: DynamicFieldSchema[];
};

function groupFieldsBySection(schema: FormSchemaInput): FieldGroup[] {
  const sectionMap = new Map<string, FieldGroup>();

  for (const field of schema.fields) {
    const sectionKey = field.section ?? "__default__";

    if (!sectionMap.has(sectionKey)) {
      const sectionMeta = schema.sections?.find((s) => s.key === sectionKey);
      sectionMap.set(sectionKey, {
        key: sectionKey,
        title: sectionMeta?.title,
        description: sectionMeta?.description,
        fields: [],
      });
    }

    sectionMap.get(sectionKey)!.fields.push(field);
  }

  return Array.from(sectionMap.values());
}

export * from "./fieldRenderer";
export * from "./schemaSelector";
export * from "./tabbedSections";
export * from "./zodBuilder";
export * from "./normalizer";
