import { z } from "zod";
import type { FormSection, OrgFormSchemasResponse, RegistrationSchema } from "@bota-apps/types";
import { dynamicFieldSchema } from "./fieldSchema";

export type {
  FormSection,
  OrgFormSchemasResponse,
  RegistrationSchema,
  TypedDetailSchema,
  TypedRegistrationSchema,
} from "@bota-apps/types";

export const formSectionSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  /** Field columns within this section (overrides the component default). */
  columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
}) satisfies z.ZodType<FormSection>;

export const registrationSchemaSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isDefault: z.boolean().optional(),
  sections: z.array(formSectionSchema).optional(),
  fields: z.array(dynamicFieldSchema),
}) satisfies z.ZodType<RegistrationSchema>;

export const orgFormSchemasResponseSchema = z.object({
  organizationId: z.string(),
  schemas: z.array(registrationSchemaSchema),
}) satisfies z.ZodType<OrgFormSchemasResponse>;
