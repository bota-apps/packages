// Pure type contracts for schema-driven forms. The matching Zod runtime lives in
// @bota-apps/schema-utils and is proven to align with these types via Equal<>
// tests there — this package ships no runtime and no dependencies.

/** The widget union the dynamic form/detail renderers understand (superset). */
export type DynamicFieldType =
  | "text"
  | "password"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "select"
  | "combobox"
  | "radio"
  | "checkbox"
  | "switch"
  | "currency";

export type DynamicFieldOption = {
  label: string;
  value: string;
};

export type DynamicFieldValidation = {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export type DynamicFieldSchema = {
  name: string;
  label: string;
  type: DynamicFieldType;
  required?: boolean;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  options?: DynamicFieldOption[];
  validation?: DynamicFieldValidation;
  section?: string;
};

/** Narrows the legal widget set for a value type V (boolean → toggle, Money → currency). */
type FieldTypeForValue<V> = [NonNullable<V>] extends [string]
  ? "text" | "password" | "textarea" | "email" | "phone" | "date" | "select" | "combobox" | "radio"
  : [NonNullable<V>] extends [number]
    ? "number"
    : [NonNullable<V>] extends [boolean]
      ? "checkbox" | "switch"
      : [NonNullable<V>] extends [{ amount: number; currency: string }]
        ? "currency"
        : DynamicFieldType;

/** A form-field schema whose `name`/`type` are checked against the input type T. */
export type TypedDynamicFieldSchema<T> = Omit<DynamicFieldSchema, "name" | "type"> & {
  name: keyof T & string;
  type: FieldTypeForValue<T[keyof T]>;
  /**
   * The generated options export this enum field renders (e.g. "projectStatusOptions").
   * A non-translating passthrough from the domain definition — carried on the built
   * schema so the i18n post-process can derive the shared enum namespace key
   * (strip a trailing "Options"). `undefined` for non-enum fields.
   */
  optionsKey?: string;
};

export type TypedDetailFieldSchema<T> = Pick<
  TypedDynamicFieldSchema<T>,
  "name" | "label" | "type" | "section" | "options" | "optionsKey"
> & {
  copyable?: boolean;
};
