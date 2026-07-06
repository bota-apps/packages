import { z } from "zod";
import type {
  DynamicFieldOption,
  DynamicFieldSchema,
  DynamicFieldValidation,
} from "@bota-apps/types";

// The Zod runtime for the dynamic-form field contracts in @bota-apps/types. We use
// `satisfies z.ZodType<T>` (not a `: z.ZodType<T>` annotation) so the enum keeps its
// concrete `z.ZodEnum` type — `optionsFromEnum` needs `.options`. The Equal<>
// assertions in ./_alignment fail the build if a schema drifts from its type.

export type {
  DynamicFieldOption,
  DynamicFieldSchema,
  DynamicFieldType,
  DynamicFieldValidation,
  TypedDetailFieldSchema,
  TypedDynamicFieldSchema,
} from "@bota-apps/types";

export const dynamicFieldTypeEnum = z.enum([
  "text",
  "password",
  "textarea",
  "number",
  "email",
  "phone",
  "date",
  "select",
  "combobox",
  "radio",
  "checkbox",
  "switch",
  "currency",
]);

export const dynamicFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
}) satisfies z.ZodType<DynamicFieldOption>;

export const dynamicFieldValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
}) satisfies z.ZodType<DynamicFieldValidation>;

export const dynamicFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: dynamicFieldTypeEnum,
  required: z.boolean().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.unknown().optional(),
  options: z.array(dynamicFieldOptionSchema).optional(),
  validation: dynamicFieldValidationSchema.optional(),
  section: z.string().optional(),
}) satisfies z.ZodType<DynamicFieldSchema>;

/** Build select/radio options from a Zod enum, with optional label overrides. */
export function optionsFromEnum<T extends [string, ...string[]]>(
  zodEnum: z.ZodEnum<T>,
  labels?: Partial<Record<T[number], string>>,
): DynamicFieldOption[] {
  return zodEnum.options.map((value: T[number]) => ({
    label: labels?.[value] ?? value.charAt(0).toUpperCase() + value.slice(1),
    value,
  }));
}
