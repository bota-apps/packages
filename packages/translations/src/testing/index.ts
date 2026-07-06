// Test utilities for driving the pure `@bota-apps/schema-utils/localize`
// transforms against a real locale bundle — without booting the i18next engine.
// Consumers build a `LocalizeContext` straight from their nested `en`/`am`
// bundle objects, so a unit test can assert a generated schema localizes without
// a running provider. No test-runner import lives here: this module compiles
// into the package and must stay framework-agnostic.
import type { LocalizeContext } from "@bota-apps/schema-utils/localize";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Resolves a dotted key (`"fields.gender"`, `"projectStatus.active"`) against a
 * nested locale tree, mirroring how the translation engine addresses nested
 * keys. Returns the string leaf, or `undefined` when the path is absent or the
 * leaf is not a string.
 */
export function resolveBundleKey(
  tree: Record<string, unknown>,
  dottedKey: string,
): string | undefined {
  let node: unknown = tree;
  for (const part of dottedKey.split(".")) {
    if (!isRecord(node)) {
      return undefined;
    }
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

/**
 * Builds a {@link LocalizeContext} backed by a nested locale bundle: `t`/`exists`
 * resolve against `bundle[namespace]`, and `enumT`/`enumExists` against
 * `bundle[enumNamespace]` (the shared enum namespace, `"enums"` by default).
 * Missing keys fall back to the key itself (via `t`) or `undefined` existence,
 * matching how `localizeFormSchema`/`localizeDetailSchema` decide to keep the
 * generated string.
 */
export function bundleLocalizeContext(
  bundle: Record<string, unknown>,
  namespace: string,
  enumNamespace = "enums",
): LocalizeContext {
  const nsRaw = bundle[namespace];
  const enumRaw = bundle[enumNamespace];
  const nsTree: Record<string, unknown> = isRecord(nsRaw) ? nsRaw : {};
  const enumTree: Record<string, unknown> = isRecord(enumRaw) ? enumRaw : {};
  return {
    t: (key) => resolveBundleKey(nsTree, key) ?? key,
    enumT: (key) => resolveBundleKey(enumTree, key) ?? key,
    exists: (key) => resolveBundleKey(nsTree, key) !== undefined,
    enumExists: (key) => resolveBundleKey(enumTree, key) !== undefined,
  };
}
