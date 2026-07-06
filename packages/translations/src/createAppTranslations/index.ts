import type { InitOptions } from "i18next";
import { useTranslation } from "react-i18next";
import { defaultInitOptions, i18n, initReactI18next, LanguageDetector } from "../instance";
import type { SupportedLanguage } from "../types";

/** One language's locale bundles, keyed by namespace. */
export type LocaleResources = Record<string, Record<string, unknown>>;

export type AppTranslationsConfig<TResources extends LocaleResources> = {
  /**
   * Locale bundles per language. English is required — it is the fallback
   * language and its namespace keys define the typed namespace union of the
   * returned hook. Other languages may cover any subset of those namespaces.
   */
  resources: { en: TResources } & Partial<Record<SupportedLanguage, LocaleResources>>;
  /**
   * Complete replacement for `defaultInitOptions`. Only the first
   * `createAppTranslations` call in a process initializes the singleton, so
   * hosts (not embedded extensions) own these options.
   */
  initOptions?: InitOptions;
};

/**
 * Registers an app's locale bundles on the shared translation singleton and
 * returns a namespace-typed translation hook. Idempotent per bundle (deep
 * merge + overwrite), safe to call from several packages in one process —
 * the first caller initializes the singleton, later callers only add bundles.
 *
 * ```ts
 * const { useAppTranslations } = createAppTranslations({
 *   resources: { en: tasksEn, am: tasksAm },
 * });
 * export const useTasksAppTranslations = useAppTranslations;
 * ```
 */
export function createAppTranslations<TResources extends LocaleResources>({
  resources,
  initOptions,
}: AppTranslationsConfig<TResources>) {
  if (!i18n.isInitialized) {
    void i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init(initOptions ?? defaultInitOptions);
  }
  for (const [language, namespaces] of Object.entries(resources)) {
    for (const [namespace, bundle] of Object.entries(namespaces ?? {})) {
      i18n.addResourceBundle(language, namespace, bundle, true, true);
    }
  }

  function useAppTranslations(namespace: Extract<keyof TResources, string>) {
    const result = useTranslation(namespace);
    // `language` is the sanctioned, engine-neutral accessor — it mirrors
    // `i18n.language` and updates on a language switch (the hook re-renders on
    // `languageChanged`). `i18n` stays on the return for existing consumers.
    return Object.assign(result, { language: result.i18n.language });
  }

  return { i18n, useAppTranslations };
}
