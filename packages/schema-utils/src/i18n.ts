// Back-compat shim. The canonical module is `./localize` — the neutral name that
// carries no i18n/engine concern. This subpath (`@bota-apps/schema-utils/i18n`)
// stays so existing consumers keep resolving; prefer
// `@bota-apps/schema-utils/localize` in new code.
export * from "./localize";
