// The generated domain model — UI-agnostic rich metadata from which form, detail,
// and future table/filter generators derive (see @bota-apps/schema-utils
// buildCreateFormSchema / buildDetailSchema). Hand-written and generic; per-domain
// values are generated and typechecked against the generated input/entity types.
import type { DynamicFieldOption, DynamicFieldType } from "./field";

export type DomainScalar = "ID" | "String" | "Int" | "Float" | "Boolean" | "Enum" | "Money";

/** The widget a domain field renders as — the same union as DynamicFieldType. */
export type DomainWidget = DynamicFieldType;

export type DomainFieldConstraint = {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export type DomainFieldDefinition<TName extends string = string> = {
  name: TName;
  label: string;
  scalar: DomainScalar;
  /** The SDL type as written, e.g. "String!" or "ProjectStatus!". */
  graphqlType: string;
  required: boolean;
  widget: DomainWidget;
  constraints?: DomainFieldConstraint;
  placeholder?: string;
  description?: string;
  section?: string;
  order: number;
  /** Set when scalar === "Enum": the GraphQL enum type name. */
  enumName?: string;
  /** Set when scalar === "Enum": the generated options export to render. */
  optionsKey?: string;
};

export type CreateInputDefinition<TInput> = {
  name: string;
  graphqlInputName: string;
  formId: string;
  formKey: string;
  title: string;
  fields: readonly DomainFieldDefinition<keyof TInput & string>[];
};

export type EntityDefinition<TEntity> = {
  name: string;
  graphqlTypeName: string;
  detailId: string;
  title: string;
  /** Detail-visible fields: every entity field except `id` and any @detail(hidden: true). */
  fields: readonly DomainFieldDefinition<keyof TEntity & string>[];
};

export type DomainDefinition<TEntity, TCreateInput> = {
  name: string;
  entity: EntityDefinition<TEntity>;
  createInput: CreateInputDefinition<TCreateInput>;
};

/** Map of generated option exports, keyed by a field's `optionsKey`. */
export type DomainOptionsMap = Record<string, DynamicFieldOption[]>;
