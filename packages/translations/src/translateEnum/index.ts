import type { TFunction } from "i18next";

/**
 * Turns an enum-like list of values into `{ value, label }` options with
 * translated labels, looked up as `${prefix}.${value}`.
 */
export function translateEnum<T extends string>(
  values: readonly T[],
  t: TFunction,
  prefix: string,
) {
  return values.map((v) => ({
    value: v,
    label: String(t(`${prefix}.${v}`)),
  }));
}
