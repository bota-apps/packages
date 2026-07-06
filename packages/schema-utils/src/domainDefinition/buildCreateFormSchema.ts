import type { ZodType } from "zod";
import type {
  CreateInputDefinition,
  DomainFieldDefinition,
  DomainOptionsMap,
  TypedDynamicFieldSchema,
  TypedRegistrationSchema,
} from "@bota-apps/types";

// Derives a DynamicForm create-schema from a generated CreateInputDefinition.
// The mapper stays generic in TInput so the field `name` keeps its `keyof TInput`
// type all the way through `.map(...)` — the schema then types as
// TypedRegistrationSchema<TInput> naturally, with no full-schema cast.
type BuildCreateFormOptions<T extends Record<string, unknown>> = {
  /** The generated directive-aware Zod validator — becomes schema.inputSchema. */
  inputSchema?: ZodType<T>;
  /** Generated option exports keyed by a field's `optionsKey` (for enum selects). */
  options?: DomainOptionsMap;
};

function toFormField<TInput extends Record<string, unknown>>(
  field: DomainFieldDefinition<keyof TInput & string>,
  options: DomainOptionsMap,
): TypedDynamicFieldSchema<TInput> {
  return {
    name: field.name,
    label: field.label,
    // DomainWidget and DynamicFieldType are the same union of literals, but TS
    // can't prove DomainWidget ⊆ FieldTypeForValue<TInput[keyof TInput]> (which
    // narrows to a value-correlated subset). The widget↔scalar pairing is enforced
    // at generation, so this narrow cast — on the single `type` member only — is
    // the documented gap, not a whole-schema force.
    type: field.widget as TypedDynamicFieldSchema<TInput>["type"],
    required: field.required || undefined,
    validation: field.constraints,
    placeholder: field.placeholder,
    description: field.description,
    section: field.section,
    options: field.optionsKey ? (options[field.optionsKey] ?? []) : undefined,
    // Non-translating passthrough: lets the i18n post-process derive the shared
    // enum namespace key. No behavior change — DynamicForm ignores this field.
    optionsKey: field.optionsKey,
  };
}

export function buildCreateFormSchema<TInput extends Record<string, unknown>>(
  def: CreateInputDefinition<TInput>,
  { inputSchema, options = {} }: BuildCreateFormOptions<TInput> = {},
): TypedRegistrationSchema<TInput> {
  return {
    id: def.formId,
    key: def.formKey,
    name: def.title,
    inputSchema,
    fields: def.fields.map((field) => toFormField<TInput>(field, options)),
  };
}
