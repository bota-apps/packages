import { useTranslation } from "react-i18next";

/**
 * Namespace-scoped translation hook. Prefer the namespace-typed hook returned
 * by `createAppTranslations` (its namespace union comes from your English
 * bundle); reach for this lower-level primitive only when you type the
 * namespace yourself — e.g. a package that declares its own namespace union:
 *
 * ```ts
 * const { t } = useTranslations<TasksNamespace>("tasks/nav");
 * ```
 *
 * Returns the full translation result (`{ t, i18n, ready }`).
 */
export function useTranslations<Ns extends string>(namespace: Ns) {
  return useTranslation(namespace);
}
