import type { Namespace, TFunction } from "i18next";

/** Languages the platform ships translations for. */
export type SupportedLanguage = "en" | "am";

/**
 * Maps a locale-bundle object type to the same shape with every leaf widened
 * to `string`. Apps use it to type their non-default languages against the
 * English bundle: `type Resources = ToStringLeaves<typeof en>`.
 */
export type ToStringLeaves<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? ToStringLeaves<T[K]> : string;
};

export type { TFunction, Namespace };
