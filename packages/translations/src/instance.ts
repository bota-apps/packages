import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import type { InitOptions } from "i18next";
import type { SupportedLanguage } from "./types";

/**
 * Shared init options for the singleton. Apps that need different behavior
 * (another storage key, extra detectors, …) pass their own `initOptions` to
 * `createAppTranslations` — merged per-field there, never mutated here.
 */
export const defaultInitOptions: InitOptions = {
  fallbackLng: "en",
  nsSeparator: false,
  load: "languageOnly",
  returnNull: false,
  returnEmptyString: false,
  interpolation: {
    // React already escapes rendered strings.
    escapeValue: false,
  },
  detection: {
    order: ["localStorage"],
    lookupLocalStorage: "bota:locale",
    caches: ["localStorage"],
  },
};

/**
 * The process-wide translation singleton. All apps and packages share this one
 * instance so a single language switch updates every mounted surface. Kept
 * internal to this package — consumers reach it through `TranslationProvider`,
 * the hooks, and the imperative helpers below, never the underlying engine.
 */
export const i18n = i18next;

/** Switches every mounted surface to `lng`. Engine-agnostic entry point. */
export async function changeLanguage(lng: SupportedLanguage) {
  await i18n.changeLanguage(lng);
}

/** The active language code (e.g. `"en"`). */
export function getLanguage(): string {
  return i18n.language;
}

export { LanguageDetector, initReactI18next };
