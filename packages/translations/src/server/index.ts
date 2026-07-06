import { i18n } from "../instance";
import type { SupportedLanguage } from "../types";

/**
 * Server/SSR helper: switches the singleton to `lng` (loading `ns` first if
 * given) and returns a bound `t`. Node-safe — no browser detection runs until
 * the instance is initialized with the detector.
 */
export async function getServerTranslation(lng: SupportedLanguage, ns?: string) {
  await i18n.changeLanguage(lng);
  if (ns) {
    await i18n.loadNamespaces(ns);
  }
  return i18n.t.bind(i18n);
}

export { i18n as serverI18n };
