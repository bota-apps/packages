import type { z } from "zod";
import type {
  DynamicFieldOption,
  TypedDetailFieldSchema,
  TypedDetailSchema,
  TypedDynamicFieldSchema,
  TypedRegistrationSchema,
} from "@bota-apps/types";

// Optional i18n helper, kept on its own subpath so the core path carries no
// translation concern. It takes a plain translate function — no i18next (or any
// i18n library) dependency — so any app can wire its own translator.

/**
 * Build select/radio options from a Zod enum, translating each label via `t`.
 * Labels resolve from the key `${prefix}.${value}`.
 *
 * @example
 * translatedOptionsFromEnum(projectStatusEnum, t, "project.status")
 * // value "active" → { label: t("project.status.active"), value: "active" }
 */
export function translatedOptionsFromEnum<T extends [string, ...string[]]>(
  zodEnum: z.ZodEnum<T>,
  t: (key: string) => string,
  prefix: string,
): DynamicFieldOption[] {
  return zodEnum.options.map((value: T[number]) => ({
    label: t(`${prefix}.${value}`),
    value,
  }));
}

/**
 * Build translated options from an existing list of generated options (the
 * SDL-derived `<enum>Options` exports) — the generated-list counterpart of
 * {@link translatedOptionsFromEnum} for when you already hold the options rather
 * than a Zod enum. Labels resolve from `${prefix}.${value}`.
 *
 * @example
 * translatedOptions(projectStatusOptions, t, "project.status")
 * // value "active" → { label: t("project.status.active"), value: "active" }
 */
export function translatedOptions(
  options: readonly DynamicFieldOption[],
  t: (key: string) => string,
  prefix: string,
): DynamicFieldOption[] {
  return options.map((option) => ({
    label: t(`${prefix}.${option.value}`),
    value: option.value,
  }));
}

// ---------------------------------------------------------------------------
// Localization of built form/detail schemas.
//
// The builders (`buildCreateFormSchema` / `buildDetailSchema`) emit hardcoded
// generated English. These pure, immutable transforms post-process that output,
// swapping each translatable string for its localized value when the caller's
// bundle carries the key, and keeping the generated string as the fallback
// otherwise (never emitting a raw key). No i18next dependency: the caller injects
// plain translate/exists functions.
//
// Key convention (field keys are namespace-relative; enum keys live in a separate
// shared namespace, resolved via `enumT`/`enumExists`):
//   label       -> fields.<name>            (fallback: generated label)
//   placeholder -> placeholders.<name>      (only when the field has one)
//   description -> descriptions.<name>      (only when the field has one)
//   enum option -> <enumName>.<value>       (fallback: generated option label)
//
// <enumName> derives from the field's `optionsKey` (the generated options export
// reference, e.g. "projectStatusOptions") by stripping a trailing "Options"
// -> "projectStatus".
// ---------------------------------------------------------------------------

export type LocalizeContext = {
  /** Scoped to the schema's namespace — resolves `fields.*`/`placeholders.*`/`descriptions.*`. */
  t: (key: string) => string;
  /** Scoped to the shared enum namespace — resolves `<enumName>.<value>`. */
  enumT: (key: string) => string;
  /** Whether a field key resolves in the schema's namespace (keeps the generated fallback otherwise). */
  exists: (key: string) => boolean;
  /** Whether an enum key resolves in the shared enum namespace. */
  enumExists: (key: string) => boolean;
};

/** Derives the shared enum namespace key from a field's `optionsKey` (strip trailing "Options"). */
function enumNameFromOptionsKey(optionsKey: string | undefined): string | undefined {
  if (!optionsKey) {
    return undefined;
  }
  return optionsKey.replace(/Options$/u, "");
}

function localizedLabel(name: string, generated: string, ctx: LocalizeContext): string {
  const key = `fields.${name}`;
  return ctx.exists(key) ? ctx.t(key) : generated;
}

function localizedOptional(
  keyPrefix: "placeholders" | "descriptions",
  name: string,
  current: string | undefined,
  ctx: LocalizeContext,
): string | undefined {
  if (current === undefined) {
    return undefined;
  }
  const key = `${keyPrefix}.${name}`;
  return ctx.exists(key) ? ctx.t(key) : current;
}

function localizedOptions(
  options: DynamicFieldOption[] | undefined,
  optionsKey: string | undefined,
  ctx: LocalizeContext,
): DynamicFieldOption[] | undefined {
  if (!options) {
    return undefined;
  }
  const enumName = enumNameFromOptionsKey(optionsKey);
  return options.map((option) => {
    if (!enumName) {
      return { value: option.value, label: option.label };
    }
    const key = `${enumName}.${option.value}`;
    return {
      value: option.value,
      label: ctx.enumExists(key) ? ctx.enumT(key) : option.label,
    };
  });
}

function localizeFormField<T extends Record<string, unknown>>(
  field: TypedDynamicFieldSchema<T>,
  ctx: LocalizeContext,
): TypedDynamicFieldSchema<T> {
  return {
    ...field,
    label: localizedLabel(field.name, field.label, ctx),
    placeholder: localizedOptional("placeholders", field.name, field.placeholder, ctx),
    description: localizedOptional("descriptions", field.name, field.description, ctx),
    options: localizedOptions(field.options, field.optionsKey, ctx),
  };
}

function localizeDetailField<T extends Record<string, unknown>>(
  field: TypedDetailFieldSchema<T>,
  ctx: LocalizeContext,
): TypedDetailFieldSchema<T> {
  return {
    ...field,
    label: localizedLabel(field.name, field.label, ctx),
    options: localizedOptions(field.options, field.optionsKey, ctx),
  };
}

/** Immutably localizes a built create/update form schema. Never mutates its input. */
export function localizeFormSchema<T extends Record<string, unknown>>(
  schema: TypedRegistrationSchema<T>,
  ctx: LocalizeContext,
): TypedRegistrationSchema<T> {
  return {
    ...schema,
    fields: schema.fields.map((field) => localizeFormField(field, ctx)),
  };
}

/** Immutably localizes a built detail schema. Never mutates its input. */
export function localizeDetailSchema<T extends Record<string, unknown>>(
  schema: TypedDetailSchema<T>,
  ctx: LocalizeContext,
): TypedDetailSchema<T> {
  return {
    ...schema,
    fields: schema.fields.map((field) => localizeDetailField(field, ctx)),
  };
}

function enumKeysForField(field: {
  optionsKey?: string;
  options?: DynamicFieldOption[];
}): string[] {
  const enumName = enumNameFromOptionsKey(field.optionsKey);
  if (!enumName || !field.options) {
    return [];
  }
  return field.options.map((option) => `${enumName}.${option.value}`);
}

/**
 * Derives the i18n keys a built schema will request — for the coverage test.
 * Field keys are namespace-relative (`fields.<name>`); enum keys are relative to
 * the shared enum namespace (`<enumName>.<value>`). Deduplicated.
 */
export function collectSchemaKeys<T extends Record<string, unknown>>(
  schema: TypedRegistrationSchema<T> | TypedDetailSchema<T>,
): {
  fieldKeys: string[];
  placeholderKeys: string[];
  descriptionKeys: string[];
  enumKeys: string[];
} {
  const fieldKeys = new Set<string>();
  const placeholderKeys = new Set<string>();
  const descriptionKeys = new Set<string>();
  const enumKeys = new Set<string>();

  for (const field of schema.fields) {
    fieldKeys.add(`fields.${field.name}`);
    if ("placeholder" in field && field.placeholder !== undefined) {
      placeholderKeys.add(`placeholders.${field.name}`);
    }
    if ("description" in field && field.description !== undefined) {
      descriptionKeys.add(`descriptions.${field.name}`);
    }
    for (const key of enumKeysForField(field)) {
      enumKeys.add(key);
    }
  }

  return {
    fieldKeys: [...fieldKeys],
    placeholderKeys: [...placeholderKeys],
    descriptionKeys: [...descriptionKeys],
    enumKeys: [...enumKeys],
  };
}
