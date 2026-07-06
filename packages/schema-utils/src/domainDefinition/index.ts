export { buildCreateFormSchema } from "./buildCreateFormSchema";
export { buildDetailSchema } from "./buildDetailSchema";
// The DomainDefinition type family lives in @bota-apps/types; re-export for ergonomics.
export type {
  CreateInputDefinition,
  DomainDefinition,
  DomainFieldConstraint,
  DomainFieldDefinition,
  DomainOptionsMap,
  DomainScalar,
  DomainWidget,
  EntityDefinition,
} from "@bota-apps/types";
