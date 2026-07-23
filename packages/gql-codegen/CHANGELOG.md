# @bota-apps/gql-codegen

## 0.6.4

### Patch Changes

- Updated dependencies [ed5439e]
  - @bota-apps/types@0.11.0

## 0.6.3

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.
- Updated dependencies [0671cc2]
  - @bota-apps/types@0.10.1

## 0.6.2

### Patch Changes

- Updated dependencies [233fc86]
  - @bota-apps/types@0.10.0

## 0.6.0

### Minor Changes

- d05e11d: Generate detail schemas for `@detailView` output types.

  Object types with no `Create<X>Input` / `Update<X>Input` — read-only projections
  like `OrganizationProfile` — never got a detail schema, forcing apps to
  hand-author the `DynamicDetail` schema. Marking such a type `@detailView` now
  emits `<type>EntityDefinition` and `<type>DetailSchema()` from its fields
  (dropping `id`, `@detail(hidden)`, and non-renderable kinds; honoring
  `@label` / `@section` / `@order`).

  These types are **decoupled** from entity detection: they claim no root fields
  and alter no operations, so a `foo: Foo!` query stays non-null (an entity's
  `oneField` is forced nullable). `DetailViewModel` is exported for tooling.

  Additive — existing entity forms, detail schemas, and operations are unchanged.

### Patch Changes

- Republish with resolved dependency specifiers.

  `0.5.0` was published with a raw `npm publish`, which left the `workspace:^`
  (`@bota-apps/types`) and `catalog:` (`graphql`) protocols literal in the
  tarball, so every consumer install of `0.5.0` failed to resolve. This release is
  packed with `pnpm` so the protocols resolve to concrete ranges. No code change.

## 0.4.0

### Minor Changes

- c2752b6: Generate DynamicForm schemas for custom mutation inputs, not just entity CRUD.

  Previously the generator only emitted a form for an input following the
  `Create<X>Input` / `Update<X>Input` naming convention paired with an entity type
  `<X>`. Custom action mutations — `promoteEmployee(input: PromoteEmployeeInput!)`,
  `suspendEmployee`, `addEmployeeAllowance`, `generatePayPeriods`, … — got a typed
  document but no form, forcing apps to hand-author the `DynamicForm` schema that
  duplicates the SDL input's fields, widgets, and validation.

  Now every **unclaimed mutation whose argument is an input object** (preferring an
  argument named `input`) also gets its form artifacts, projected from that input:

  - `domainDefinitions.ts` — `<mutationName>Definition` (a `CreateInputDefinition`)
  - `inputSchemas.ts` — `<inputName>Schema` (directive-aware Zod)
  - `forms.ts` — `<mutationName>FormSchema(): TypedRegistrationSchema<Input>`

  The field metadata comes from the same `@widget` / `@min` / `@label` directives
  the SDL input already carries, so generated action forms honor the input's widget
  choices (currency, date, textarea, enum select) automatically. Scalar-only actions
  (`lockPayPeriod(id: ID!)`) produce no form. `ActionFormModel` is exported for
  tooling. Additive — existing entity forms and operations are unchanged.

## 0.3.1

### Patch Changes

- Updated dependencies [a7c25fd]
  - @bota-apps/types@0.8.0

## 0.3.0

### Minor Changes

- a1055ec: Emit documents for every Query/Mutation root field, not just entity CRUD. Root fields unclaimed by an entity's conventions (singleton/aggregate queries, custom mutations) now generate `TypedDocumentNode` documents with full nested selections; scalar/enum/JSON returns emit selection-less documents typed faithfully to GraphQL nullability. Underscore-prefixed root fields are skipped as internal, unemittable returns degrade to warnings, and Query/Mutation document-name collisions are error diagnostics. Also fixes variables typing: nullable args are now optional (`status?: EmployeeStatus | null`) and list args render as arrays (`ids: string[]`).

## 0.2.0

### Minor Changes

- f5de1e2: New package: SDL-first code generator. From an annotated GraphQL SDL it derives
  domain definitions, create/update form schemas + detail schemas, enum display
  metadata, directive-aware Zod input validators (nested inputs included), and
  typed `TypedDocumentNode` documents (list/one/create/update/delete) with
  nested, cycle-guarded selection sets. Boolean fields render as `checkbox`
  (`switch` via `@widget`), `Money` fields as `currency`. Unsupported SDL
  degrades per-artifact with diagnostics instead of failing the run, and every
  generated operation is validated against the schema before it is written.
  Ships a `bota-gql-codegen` CLI; pair with `@graphql-codegen/typescript` for the
  base types file.

### Patch Changes

- Updated dependencies [f5de1e2]
  - @bota-apps/types@0.7.0
