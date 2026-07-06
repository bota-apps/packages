import { useMemo } from "react";
import type { TypedDetailSchema, TypedRegistrationSchema } from "@bota-apps/types";
import {
  collectSchemaKeys,
  localizeDetailSchema,
  localizeFormSchema,
  type LocalizeContext,
} from "@bota-apps/schema-utils/localize";
import { i18n } from "../instance";
import { useTranslations } from "../useTranslations";

// React bindings for the pure `@bota-apps/schema-utils/i18n` transforms. They
// scope translators to the schema's namespace (fields) and a shared enum
// namespace (default "enums"), then memoize the localized schema on the active
// language so <DynamicForm>/<DynamicDetail> get a ready-to-render schema whose
// labels and enum options follow the current locale.

const defaultEnumNs = "enums";

// `i18n.exists` is namespace-aware via its options bag. With `nsSeparator: false`
// (see defaultInitOptions) the namespace can only be passed here, not embedded
// in the key — so field keys carry no `:` and the ns is supplied explicitly.
function makeContext(
  t: (key: string) => string,
  enumT: (key: string) => string,
  ns: string,
  enumNs: string,
): LocalizeContext {
  return {
    t,
    enumT,
    exists: (key) => i18n.exists(key, { ns }),
    enumExists: (key) => i18n.exists(key, { ns: enumNs }),
  };
}

export function useLocalizedFormSchema<T extends Record<string, unknown>>(
  factory: () => TypedRegistrationSchema<T>,
  ns: string,
  opts?: { enumNs?: string },
): TypedRegistrationSchema<T> {
  const enumNs = opts?.enumNs ?? defaultEnumNs;
  // `t`/`enumT` are bound to the active language and change identity on a switch,
  // so listing them as deps recomputes the localized schema when the locale changes.
  const { t } = useTranslations(ns);
  const { t: enumT } = useTranslations(enumNs);

  return useMemo(
    () =>
      localizeFormSchema(
        factory(),
        makeContext(
          (key) => t(key),
          (key) => enumT(key),
          ns,
          enumNs,
        ),
      ),
    [factory, ns, enumNs, t, enumT],
  );
}

export function useLocalizedDetailSchema<T extends Record<string, unknown>>(
  factory: () => TypedDetailSchema<T>,
  ns: string,
  opts?: { enumNs?: string },
): TypedDetailSchema<T> {
  const enumNs = opts?.enumNs ?? defaultEnumNs;
  const { t } = useTranslations(ns);
  const { t: enumT } = useTranslations(enumNs);

  return useMemo(
    () =>
      localizeDetailSchema(
        factory(),
        makeContext(
          (key) => t(key),
          (key) => enumT(key),
          ns,
          enumNs,
        ),
      ),
    [factory, ns, enumNs, t, enumT],
  );
}

// ---------------------------------------------------------------------------
// Localized-schema registry entries.
//
// A consumer app builds a registry mapping each generated create/update form
// factory and each detail factory to the translation namespace that owns its
// `fields.*` strings. Only that mapping is app-specific; the entry shape, the
// makers, and the hooks are generic and live here.
// ---------------------------------------------------------------------------

// The translation keys a built schema requests. `ReturnType<typeof
// collectSchemaKeys>` collapses the maker's generic `T` to a single, uniform
// shape — so `Object.values(registry)` over a map of mixed value types stays
// iterable without every entry widening into one union.
type CollectedKeys = ReturnType<typeof collectSchemaKeys>;

export type LocalizedFormEntry<T extends Record<string, unknown>> = {
  factory: () => TypedRegistrationSchema<T>;
  ns: string;
  collect: () => CollectedKeys;
};

export type LocalizedDetailEntry<T extends Record<string, unknown>> = {
  factory: () => TypedDetailSchema<T>;
  ns: string;
  collect: () => CollectedKeys;
};

/**
 * Builds a form registry entry: pairs a generated form factory with the
 * namespace owning its `fields.*` strings. `collect()`'s type is independent of
 * `T`, so callers can `Object.values(registry)` without collapsing the union.
 */
export function localizedFormEntry<T extends Record<string, unknown>>(
  factory: () => TypedRegistrationSchema<T>,
  ns: string,
): LocalizedFormEntry<T> {
  return { factory, ns, collect: () => collectSchemaKeys(factory()) };
}

/** Builds a detail registry entry — the detail-schema counterpart of {@link localizedFormEntry}. */
export function localizedDetailEntry<T extends Record<string, unknown>>(
  factory: () => TypedDetailSchema<T>,
  ns: string,
): LocalizedDetailEntry<T> {
  return { factory, ns, collect: () => collectSchemaKeys(factory()) };
}

/**
 * Localizes a form entry for the active language. A concrete entry keeps its
 * value type `T`, so the returned schema is concrete for `<DynamicForm>`. Enum
 * option labels resolve from the shared enum namespace (default `"enums"`, as
 * {@link useLocalizedFormSchema} already defaults it).
 */
export function useLocalizedForm<T extends Record<string, unknown>>(
  entry: LocalizedFormEntry<T>,
): TypedRegistrationSchema<T> {
  return useLocalizedFormSchema(entry.factory, entry.ns);
}

/** Localizes a detail entry for the active language — the counterpart of {@link useLocalizedForm}. */
export function useLocalizedDetail<T extends Record<string, unknown>>(
  entry: LocalizedDetailEntry<T>,
): TypedDetailSchema<T> {
  return useLocalizedDetailSchema(entry.factory, entry.ns);
}
