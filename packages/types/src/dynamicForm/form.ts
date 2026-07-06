import type { DynamicFieldSchema, TypedDynamicFieldSchema, TypedDetailFieldSchema } from "./field";

export type FormSection = {
  key: string;
  title: string;
  description?: string;
  /** Field columns within this section (overrides the component default). */
  columns?: 1 | 2 | 3;
};

export type RegistrationSchema = {
  id: string;
  key: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  sections?: FormSection[];
  fields: DynamicFieldSchema[];
};

/**
 * Structural validator a form may carry to validate its input. Zod's `ZodType<T>`
 * satisfies this (its `safeParse` returns `{ success: boolean; ... }`), so apps can
 * pass a real Zod schema while this package keeps zero dependency on Zod.
 */
export type ValidatorLike<T> = {
  safeParse(value: unknown): { success: true; data: T } | { success: false };
};

/** A form schema whose field `name`s/`type`s are checked against the input type T. */
export type TypedRegistrationSchema<T extends Record<string, unknown>> = Omit<
  RegistrationSchema,
  "fields"
> & {
  /** A directive-aware validator for this input (the single validation source). */
  inputSchema?: ValidatorLike<T>;
  fields: readonly TypedDynamicFieldSchema<T>[];
};

export type TypedDetailSchema<T extends Record<string, unknown>> = {
  id: string;
  name: string;
  sections?: FormSection[];
  fields: readonly TypedDetailFieldSchema<T>[];
};

export type OrgFormSchemasResponse = {
  organizationId: string;
  schemas: RegistrationSchema[];
};
