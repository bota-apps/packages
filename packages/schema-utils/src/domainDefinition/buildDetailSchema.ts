import type {
  DomainFieldDefinition,
  DomainOptionsMap,
  EntityDefinition,
  TypedDetailFieldSchema,
  TypedDetailSchema,
} from "@bota-apps/types";

// Derives a DynamicDetail schema from a generated EntityDefinition. The entity's
// `fields` are already the detail-visible set (id and @detail(hidden) fields were
// dropped at generation). The mapper stays generic in TEntity so each field `name`
// keeps its `keyof TEntity` type, and the schema types as TypedDetailSchema<TEntity>
// naturally — no full-schema cast.
type BuildDetailOptions = {
  /** Generated option exports keyed by a field's `optionsKey` (for enum selects). */
  options?: DomainOptionsMap;
};

function toDetailField<TEntity extends Record<string, unknown>>(
  field: DomainFieldDefinition<keyof TEntity & string>,
  options: DomainOptionsMap,
): TypedDetailFieldSchema<TEntity> {
  return {
    name: field.name,
    label: field.label,
    // Same narrow gap as the create builder: DomainWidget and DynamicFieldType are
    // the same union, but TS can't prove it against the value-correlated subset.
    // Cast is confined to the single `type` member; the pairing is enforced at gen.
    type: field.widget as TypedDetailFieldSchema<TEntity>["type"],
    section: field.section,
    options: field.optionsKey ? (options[field.optionsKey] ?? []) : undefined,
    // Non-translating passthrough: lets the i18n post-process derive the shared
    // enum namespace key. No behavior change — DynamicDetail ignores this field.
    optionsKey: field.optionsKey,
  };
}

export function buildDetailSchema<TEntity extends Record<string, unknown>>(
  def: EntityDefinition<TEntity>,
  { options = {} }: BuildDetailOptions = {},
): TypedDetailSchema<TEntity> {
  return {
    id: def.detailId,
    name: def.title,
    fields: def.fields.map((field) => toDetailField<TEntity>(field, options)),
  };
}
