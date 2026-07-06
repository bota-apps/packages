# @bota-apps/types

Framework-free TypeScript contracts shared across the `@bota-apps/*` packages.
**Zero runtime, zero dependencies** — just types. Its Zod runtime counterpart is
[`@bota-apps/schema-utils`](../schema-utils), whose schemas are proven at build
time (via `satisfies z.ZodType<T>` + `Equal<>` assertions) to match these types
exactly, so the contracts and their validators can never silently drift.

Domain data — users, organizations, domain entities, audit entries, pagination
envelopes — is **owned by the API**, not this package. `@bota-apps/types` defines
only the framework's own contracts and the minimal structural CONSTRAINTS it
expects on API-owned types (e.g. `SessionUser`); apps register their real
API-owned types once via declaration merging (`AuthRegister`).

## Install

```bash
pnpm add -D @bota-apps/types
```

Types-only, so a dev dependency is enough.

## Usage

```ts
import type {
  TypedRegistrationSchema,
  TypedDetailSchema,
  DynamicFieldSchema,
  DomainDefinition,
  Money,
  CurrencyCode,
  BadgeTone,
} from "@bota-apps/types";
import type { FeatureBoundaryOptions, FeatureNodeDef } from "@bota-apps/types/fm";
import type { SessionUser, AuthState } from "@bota-apps/types/auth";

type ProjectInput = { name: string; budget: Money };

const schema: TypedRegistrationSchema<ProjectInput> = {
  id: "project",
  key: "project",
  name: "Project",
  fields: [{ name: "name", label: "Name", type: "text" }],
};
```

### Discriminated unions, not optional bags

State contracts model mutually-exclusive shapes as unions discriminated by a
literal `status`, so narrowing the discriminant narrows the payload:

```ts
import type { AuthState } from "@bota-apps/types/auth";

function greet(state: AuthState) {
  if (state.status === "authenticated") {
    return `Hi ${state.user.name}`; // `user` is present in this member only
  }
  return "Please sign in";
}
```

### Registering your API-owned user type

Apps map their real user type onto the framework's `SessionUser` constraint once,
via declaration merging, so every auth surface is typed app-wide without
call-site generics:

```ts
import type { SessionUser } from "@bota-apps/types/auth";

declare module "@bota-apps/types/auth" {
  interface AuthRegister {
    user: MyApiUser; // must structurally satisfy SessionUser
  }
}
```

## Subpaths

| Import                  | Contents                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@bota-apps/types`      | Schema-driven forms (`DynamicFieldSchema`, `DynamicFieldType`, `DynamicFieldOption`, `RegistrationSchema`, `TypedRegistrationSchema<T>`, `TypedDetailSchema<T>`, `FormSection`), the `DomainDefinition` family (`DomainDefinition`, `EntityDefinition`, `CreateInputDefinition`, `DomainFieldDefinition`), `Money`/`CurrencyCode`/`CurrencyInfo`/`FormatCurrencyOptions`, `BadgeTone` |
| `@bota-apps/types/fm`   | Feature-management + app-manifest shapes: `FeatureNodeDef`, `FeatureBoundaryOptions<T>`, `FeatureOptionsInput`, `ExpectedStatusMap`, `ResolvedFeature`, `FeatureCollector`, `AppManifest`, `FeatureRuntime`, `AppErrorLike`, runtime seam types                                                                                                                                       |
| `@bota-apps/types/auth` | Cookie-session auth contracts: `SessionUser` constraint, `AuthState`/`AuthStatus` discriminated union, `AuthStore`/`AuthClient`, `SessionPaths`/`SessionEndpoint`, and the `AuthRegister` declaration-merging seam                                                                                                                                                                    |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
