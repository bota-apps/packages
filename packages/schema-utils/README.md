# @bota-apps/schema-utils

The Zod runtime behind [`@bota-apps/types`](../types): currency/money schemas and
formatters, dynamic form/field/detail validators, and domain-definition form
builders — plus optional localization helpers on subpaths. Every schema is proven
to align with its `@bota-apps/types` contract at build time (via
`satisfies z.ZodType<T>` + `Equal<>` assertions), so the runtime and the types can
never silently drift.

Environment/runtime config validators are **not** here — they live in
`@bota-apps/app-config`.

## Install

```bash
pnpm add @bota-apps/schema-utils
# zod is bundled as a dependency; @bota-apps/types comes along transitively
```

## Usage

```ts
import {
  money,
  moneySchema,
  sumMoney,
  currencies,
  currencyCodes,
  formatMoney,
  createCurrencyFormatter,
  dynamicFieldSchema,
  optionsFromEnum,
  registrationSchemaSchema,
  buildCreateFormSchema,
  buildDetailSchema,
  badgeTones,
} from "@bota-apps/schema-utils";
```

### Currency & money

`Money` is `{ amount, currency }`; the formatters cache their `Intl.NumberFormat`
instances internally (locale-data resolution is expensive and they run per table
cell / chart tick):

```ts
const price = money(1145000, "USD"); // { amount: 1145000, currency: "USD" }

formatMoney(price); // "$1,145,000.00"
formatMoneyCompact(price); // compact form (e.g. "$1.1M")
formatMoneyShort(price); // short form

sumMoney([money(10, "USD"), money(5, "USD")], "USD"); // { amount: 15, currency: "USD" }

moneySchema.parse({ amount: 100, currency: "USD" }); // validated Money
```

Format a bare amount against a currency code, or build a reusable formatter over
your own currency registry:

```ts
formatCurrency(1145000, "USD"); // "$1,145,000.00"
getCurrencyLabel("USD"); // human label from `currencies`

const fmt = createCurrencyFormatter(); // defaults to the built-in registry
fmt.format(1145000, "USD");
```

### Dynamic form / field schemas

Validate schema-driven forms and derive `<select>` options from a Zod enum:

```ts
import { z } from "zod";

const roleEnum = z.enum(["admin", "member", "viewer"]);
optionsFromEnum(roleEnum); // [{ value: "admin", label: "Admin" }, …]
optionsFromEnum(roleEnum, { admin: "Administrator" }); // override individual labels

registrationSchemaSchema.parse(remoteSchema); // validate a form definition
dynamicFieldSchema.parse(remoteField); // validate a single field
```

### Domain-definition builders

Turn an app's `DomainDefinition` into typed registration and detail schemas:

```ts
const createSchema = buildCreateFormSchema(projectDefinition);
const detailSchema = buildDetailSchema(projectDefinition);
```

### Localization (subpath)

Localization helpers stay off the core entry so the base import carries no i18n
concern. There is **no i18n library dependency** — you pass your own `t`:

```ts
import {
  translatedOptionsFromEnum,
  localizeFormSchema,
  localizeDetailSchema,
} from "@bota-apps/schema-utils/i18n";

translatedOptionsFromEnum(roleEnum, t, "roles"); // localized <select> options
const localized = localizeFormSchema(schema, { t, enumT }); // translated labels/placeholders
```

## Subpaths

| Import                             | What                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@bota-apps/schema-utils`          | Currency/money (`money`, `moneySchema`, `sumMoney`, `currencies`, `currencyCodes`, `currencyCodeSchema`, `createCurrencyFormatter`, `formatMoney*`, `formatCurrency*`, `getCurrencyLabel`), dynamic-form zod (`dynamicFieldSchema`, `dynamicFieldTypeEnum`, `optionsFromEnum`, `registrationSchemaSchema`, `formSectionSchema`), domain builders (`buildCreateFormSchema`, `buildDetailSchema`), `badgeTones` — plus re-exported types from `@bota-apps/types` |
| `@bota-apps/schema-utils/localize` | `localizeFormSchema`, `localizeDetailSchema`, `translatedOptions`, `translatedOptionsFromEnum`, `collectSchemaKeys`, `LocalizeContext`                                                                                                                                                                                                                                                                                                                         |
| `@bota-apps/schema-utils/i18n`     | Re-exports the `localize` surface (stable alias for the localization helpers)                                                                                                                                                                                                                                                                                                                                                                                  |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
