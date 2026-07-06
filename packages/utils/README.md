# @bota-apps/utils

Framework-free utility modules shared across the `@bota-apps/*` packages — one
directory per concern, each also published as its own subpath so consumers import
exactly what they need. The package is side-effect-free (`"sideEffects": false`),
so bundlers tree-shake anything you don't import, whether you reach for the root
entry or a subpath.

## Install

```bash
pnpm add @bota-apps/utils
# peer/runtime dep: date-fns (bundled as a dependency, used by ./time)
```

## Usage

Import a single concern from its subpath, or pull everything from the root entry —
both resolve to the same code:

```ts
import { formatDate, formatRelativeTime } from "@bota-apps/utils/time";
import { formatNumber } from "@bota-apps/utils/number";
import { getSubdomain, buildSubdomainUrl } from "@bota-apps/utils/url";
import type { Equal, Expect } from "@bota-apps/utils/type";

// or, from the root barrel:
import { formatDate, formatNumber } from "@bota-apps/utils";
```

### `./time` — date/time formatting over date-fns

Presets that render an ISO string or `Date` consistently across the apps:

```ts
formatDate("2026-07-06"); // "Jul 6, 2026"
formatDateShort("2026-07-06"); // short form
formatDateCompact("2026-07-06"); // compact form
formatMonthYear("2026-07-06"); // "Jul 2026"
formatRelativeTime("2026-07-04"); // "2 days ago"
formatTenure("2020-01-01"); // e.g. "6 years"

parseDate("2026-07-06"); // Date | undefined (undefined for empty/invalid)
toISODateString(new Date()); // "2026-07-06"
isPastDate("2020-01-01"); // true
```

### `./number` — number formatting

```ts
formatNumber(1145000); // "1,145,000"
```

### `./url` — tenant subdomain helpers

For multi-tenant apps served under `<tenant>.example.com`. `getSubdomain` throws
when the host is not under an allowed base domain or carries no subdomain (apps
that call it require a tenant to operate); `buildSubdomainUrl` preserves the
current protocol and port:

```ts
const baseDomains = ["example.com", "localhost"];

getSubdomain(baseDomains, "acme.example.com"); // "acme"
buildSubdomainUrl("acme", baseDomains, "/dashboard");
// "https://acme.example.com/dashboard"
```

Both default their location argument to `window.location`, so in the browser you
can call `getSubdomain(baseDomains)` with no second argument.

### `./type` — build-time type assertions

Zero-runtime helpers for `*.test-d`-style type checks:

```ts
import type { Equal, Expect } from "@bota-apps/utils/type";

type _check = Expect<Equal<"a" | "b", "a" | "b">>; // compiles iff the types match
```

## Subpaths

| Import                    | What                                                                                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@bota-apps/utils`        | Root barrel — re-exports every module below                                                                                                                                       |
| `@bota-apps/utils/time`   | `formatDate`, `formatDateShort`, `formatDateCompact`, `formatMonthYear`, `formatRelativeTime`, `formatRelativeDate`, `formatTenure`, `parseDate`, `toISODateString`, `isPastDate` |
| `@bota-apps/utils/number` | `formatNumber`                                                                                                                                                                    |
| `@bota-apps/utils/url`    | `getSubdomain`, `buildSubdomainUrl`, `UrlLocation`                                                                                                                                |
| `@bota-apps/utils/type`   | `Equal`, `Expect` type-level helpers                                                                                                                                              |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
