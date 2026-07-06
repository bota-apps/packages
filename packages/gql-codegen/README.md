# @bota-apps/gql-codegen

SDL-first code generator. Reads an annotated GraphQL SDL — the API-side single
source of truth — and derives everything the UI would otherwise hand-maintain:

| File                   | Contents                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domainDefinitions.ts` | Rich per-entity field model (`EntityDefinition` / `CreateInputDefinition`), plus `<mutation>Definition` for custom action inputs                                              |
| `forms.ts`             | Create/update form schemas + detail schemas + `<mutation>FormSchema` for custom action mutations, built via `@bota-apps/schema-utils`                                         |
| `enums.ts`             | `<enum>Meta` (label + Badge tone from `@display`) and `<enum>Options`                                                                                                         |
| `inputSchemas.ts`      | Directive-aware Zod validators for every create/update **and action-mutation** input (nested inputs included)                                                                 |
| `operations.ts`        | `TypedDocumentNode` documents for **every** Query/Mutation root field — entity CRUD plus custom operations (aggregates, singletons, domain mutations), with nested selections |

It pairs with `@graphql-codegen/typescript`, which emits the base `types.ts`
the artifacts import (`--types-import`, default `./types`).

## Install

```bash
pnpm add -D @bota-apps/gql-codegen
# pairs with @graphql-codegen/typescript for the base types.ts
```

## Usage

### CLI

The package ships a `bota-gql-codegen` bin. It reads every `.graphql` file under
`--schema` (recursive, sorted for determinism), writes the five artifact files
into `--out`, prints diagnostics to stderr, and exits non-zero when any
diagnostic is an `error`:

```bash
bota-gql-codegen --schema ../../mock-graphql/src --out src/schema/generated
```

| Flag             | Default    | What                                                                              |
| ---------------- | ---------- | --------------------------------------------------------------------------------- |
| `--schema <dir>` | _required_ | Directory scanned recursively for `.graphql` SDL files                            |
| `--out <dir>`    | _required_ | Output directory for the five generated files (created if missing)                |
| `--types-import` | `./types`  | Import specifier for the base types file emitted by `@graphql-codegen/typescript` |
| `--money-type`   | `Money`    | Object type treated as the platform money value                                   |
| `--quiet`        | `false`    | Report only `error` diagnostics (suppress `info`/`warning`)                       |

### Programmatic

```ts
import { collectSdl, generateFromSdl } from "@bota-apps/gql-codegen";

const sdl = collectSdl("../../mock-graphql/src").join("\n");
const { files, diagnostics } = generateFromSdl(sdl, {
  typesImportPath: "./types", // default
  moneyTypeName: "Money", // default
  maxSelectionDepth: 4, // default nesting depth for selection sets
});

// files: { domainDefinitions, forms, enums, inputSchemas, operations } — each a string
```

## API

| Export                                                                                                                                 | What                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `generateFromSdl(sdl, options?)`                                                                                                       | Orchestrator: SDL string in → `{ files, diagnostics }` (`GenerateResult`) out |
| `collectSdl(dir)`                                                                                                                      | Reads every `.graphql` file under `dir` (recursive, sorted) → `string[]`      |
| `buildModel(sdl, options?)`                                                                                                            | Lower-level SDL → `SdlModel` domain model the emitters consume                |
| `humanize(name)`                                                                                                                       | Field/enum name → human label (the same helper used for default `@label`s)    |
| `widgetForField` / `widgetAllowed` / `isDomainWidget`                                                                                  | Widget-policy helpers mapping GraphQL types → form widgets                    |
| `GenerateOptions` / `GenerateResult` / `GeneratedFiles`                                                                                | Option and result types for `generateFromSdl`                                 |
| `SdlModel` / `EntityModel` / `FieldModel` / `RootFieldModel` / `InputFormModel` / `ActionFormModel` / `DetailViewModel` / `Diagnostic` | Domain-model types returned by `buildModel`                                   |

## What the SDL expresses

- **Entities** are object types with a matching `Create<X>Input` and/or
  `Update<X>Input` (update-only entities are supported — services without
  create/delete exist).
- **Custom operations** are all remaining Query/Mutation root fields — each
  gets a document too (scalar/enum/`JSON` returns emit selection-less
  documents), so apps never hand-write operations. Underscore-prefixed root
  fields (`_health`) are treated as internal and skipped.
- **Action forms** are projected from a custom mutation's input-object argument
  (preferring one named `input`): `promoteProject(input: PromoteProjectInput!)`
  yields `promoteProjectFormSchema()` alongside its document, using the input's
  own `@widget`/`@min`/`@label` directives. Scalar-only actions
  (`lockTask(id: ID!)`) get no form. So apps stop hand-authoring the forms
  that just mirror an SDL input.
- **`@detailView` types** are read-only projections with no `Create/Update`
  input (e.g. `type OrganizationProfile @detailView`). They get a
  `<type>DetailSchema()` so apps stop hand-authoring `DynamicDetail` schemas, but
  claim no root fields — a `profile: Profile!` query stays non-null (unlike an
  entity's nullable `oneField`).
- **Widgets** come from GraphQL _types_, never field _names_: enum → `select`,
  `Boolean` → `checkbox`, `Money` → `currency`, `Int`/`Float` → `number`,
  everything else → `text`. Specialized widgets (`email`, `phone`, `date`,
  `textarea`, `switch`, …) are requested explicitly with `@widget(type:)`.
- **Validation** directives (`@min`, `@max`, `@minLength`, `@maxLength`,
  `@pattern`) feed both the form field constraints and the Zod schemas.
- **Display** metadata: `@display(label:, tone:)` on enum values,
  `@label` / `@placeholder` / `@description` / `@section` / `@order` on fields,
  `@detail(hidden: true)` to drop a field from detail views.

## Graceful degradation, loud contradictions

SDL a form can't render never aborts the run:

- a **required** unsupported input field (list, nested input object, `JSON`)
  skips that one form — the entity's documents and Zod schemas still generate;
- an **optional** unsupported input field is omitted from the form but kept in Zod;
- entity fields a detail view can't render (lists, nested objects, `JSON`) are
  skipped from the detail schema but still fetched by the generated selections;
- nested selections are cycle-guarded and depth-capped (`maxSelectionDepth`),
  and fields taking required arguments are left to hand-written documents.

Each of these is reported as an `info`/`warning` diagnostic. Actual
contradictions — an `@widget` that doesn't fit the field's type, an empty enum
— are `error` diagnostics and fail the CLI.

Every generated operation is validated against the schema built from the same
SDL before it is returned, so emitted documents are schema-valid by
construction.

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
