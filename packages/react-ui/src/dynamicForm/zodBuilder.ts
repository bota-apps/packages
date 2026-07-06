import { z } from "zod";
import type { DynamicFieldSchema } from "@bota-apps/types";

/**
 * Overridable validation messages. Defaults are English; inject translated
 * builders for localized apps (same pattern as schema-utils/i18n).
 */
export type FormValidationMessages = {
  required?: (label: string) => string;
  invalidEmail?: (label: string) => string;
  invalidNumber?: (label: string) => string;
};

export type BuildFormZodSchemaOptions = {
  messages?: FormValidationMessages;
};

const defaultMessages: Required<FormValidationMessages> = {
  required: (label) => `${label} is required`,
  invalidEmail: () => "Invalid email address",
  invalidNumber: (label) => `${label} must be a number`,
};

/** Treat empty form input as absent so coercion can't turn "" into 0. */
function emptyToUndefined(value: unknown): unknown {
  return value === "" || value === null ? undefined : value;
}

function buildFieldZod(
  field: DynamicFieldSchema,
  messages: Required<FormValidationMessages>,
): z.ZodTypeAny {
  const { type, required, validation } = field;

  switch (type) {
    case "checkbox":
    case "switch": {
      return z.boolean().default(false);
    }

    case "number":
    case "currency": {
      let schema = z.coerce.number({
        invalid_type_error: messages.invalidNumber(field.label),
      });
      if (validation?.min !== undefined) {
        schema = schema.min(validation.min);
      }
      if (validation?.max !== undefined) {
        schema = schema.max(validation.max);
      }
      // Empty input must not coerce to 0 — a required empty field has to fail
      // with the required message, not silently submit 0. The absence check
      // runs before coercion, which would otherwise turn undefined into NaN.
      if (required) {
        return z.preprocess(
          emptyToUndefined,
          z
            .unknown()
            .refine((value) => value !== undefined, { message: messages.required(field.label) })
            .pipe(schema),
        );
      }
      return z.preprocess(emptyToUndefined, schema.optional());
    }

    default: {
      let schema = z.string();
      // Required goes first so an empty value reports "required", not a
      // downstream format error like "invalid email".
      if (required) {
        schema = schema.min(1, messages.required(field.label));
      }
      if (validation?.minLength !== undefined) {
        schema = schema.min(validation.minLength);
      }
      if (validation?.maxLength !== undefined) {
        schema = schema.max(validation.maxLength);
      }
      if (validation?.pattern) {
        schema = schema.regex(new RegExp(validation.pattern));
      }
      if (type === "email") {
        schema = schema.email(messages.invalidEmail(field.label));
      }
      if (required) {
        return schema;
      }
      return schema.optional().or(z.literal("")).or(z.null());
    }
  }
}

export function buildFormZodSchema(
  fields: readonly DynamicFieldSchema[],
  options: BuildFormZodSchemaOptions = {},
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  // Per-key fallback (not an object spread): a caller passing an
  // explicitly-undefined key must still get the English default.
  const messages: Required<FormValidationMessages> = {
    required: options.messages?.required ?? defaultMessages.required,
    invalidEmail: options.messages?.invalidEmail ?? defaultMessages.invalidEmail,
    invalidNumber: options.messages?.invalidNumber ?? defaultMessages.invalidNumber,
  };
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    shape[field.name] = buildFieldZod(field, messages);
  }

  return z.object(shape);
}

export function buildDefaultValues(fields: readonly DynamicFieldSchema[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
      continue;
    }

    switch (field.type) {
      case "checkbox":
      case "switch":
        defaults[field.name] = false;
        break;
      case "number":
      case "currency":
        // Start empty even when required — defaulting to 0 would mask the
        // required check and let untouched fields submit 0.
        defaults[field.name] = undefined;
        break;
      default:
        defaults[field.name] = "";
        break;
    }
  }

  return defaults;
}
