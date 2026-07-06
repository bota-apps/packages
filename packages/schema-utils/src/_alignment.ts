// Build-time proof that each Zod schema's inferred type EXACTLY equals its pure
// contract in @bota-apps/types. `satisfies z.ZodType<T>` (at each schema) proves
// one direction; these Equal<> checks prove exactness both ways. This module is
// compiled but intentionally NOT re-exported from index.ts — it ships nothing
// public; it exists only to fail the build if the runtime and types drift.
import type { z } from "zod";
import type { Equal, Expect } from "@bota-apps/utils/type";
import type {
  BadgeTone,
  CurrencyCode,
  DynamicFieldSchema,
  DynamicFieldType,
  FormSection,
  Money,
  OrgFormSchemasResponse,
  RegistrationSchema,
} from "@bota-apps/types";
import type { currencyCodeSchema, moneySchema } from "./currency";
import type { dynamicFieldSchema, dynamicFieldTypeEnum } from "./dynamicForm/fieldSchema";
import type {
  formSectionSchema,
  orgFormSchemasResponseSchema,
  registrationSchemaSchema,
} from "./dynamicForm/formSchema";
import type { badgeTones } from "./tone";

export type SchemaTypeAlignment = [
  Expect<Equal<z.infer<typeof currencyCodeSchema>, CurrencyCode>>,
  Expect<Equal<z.infer<typeof moneySchema>, Money>>,
  Expect<Equal<z.infer<typeof dynamicFieldTypeEnum>, DynamicFieldType>>,
  Expect<Equal<z.infer<typeof dynamicFieldSchema>, DynamicFieldSchema>>,
  Expect<Equal<z.infer<typeof formSectionSchema>, FormSection>>,
  Expect<Equal<z.infer<typeof registrationSchemaSchema>, RegistrationSchema>>,
  Expect<Equal<z.infer<typeof orgFormSchemasResponseSchema>, OrgFormSchemasResponse>>,
  Expect<Equal<(typeof badgeTones)[number], BadgeTone>>,
];
