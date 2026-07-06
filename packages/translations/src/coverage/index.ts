import type { TypedDetailSchema, TypedRegistrationSchema } from "@bota-apps/types";
import { collectSchemaKeys } from "@bota-apps/schema-utils/i18n";

// Pure, React-free coverage utilities — safe to import from a test. They compare
// what a language bundle provides against what another bundle (or a set of
// generated schemas) requires, using the flat "namespace:dotted.key" address as
// the common currency.

/** A language's locale bundle: namespace -> nested key tree. */
type Bundle = Record<string, Record<string, unknown>>;

const defaultEnumNs = "enums";

function collectLeaves(value: unknown, prefix: string, out: string[]): void {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const [childKey, childValue] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${childKey}` : childKey;
      collectLeaves(childValue, path, out);
    }
    return;
  }
  out.push(prefix);
}

/** "namespace:dotted.key" for every leaf in a language bundle. */
export function flattenBundleKeys(bundle: Bundle): Set<string> {
  const keys = new Set<string>();
  for (const [namespace, tree] of Object.entries(bundle)) {
    const leaves: string[] = [];
    collectLeaves(tree, "", leaves);
    for (const dotted of leaves) {
      keys.add(dotted ? `${namespace}:${dotted}` : namespace);
    }
  }
  return keys;
}

/** Keys present in `reference` but absent in `target` (e.g. en vs am). Sorted. */
export function findMissingKeys(reference: Bundle, target: Bundle): string[] {
  const provided = flattenBundleKeys(target);
  const missing: string[] = [];
  for (const key of flattenBundleKeys(reference)) {
    if (!provided.has(key)) {
      missing.push(key);
    }
  }
  return missing.sort();
}

type SchemaEntry = {
  schema:
    TypedRegistrationSchema<Record<string, unknown>> | TypedDetailSchema<Record<string, unknown>>;
  ns: string;
};

/**
 * The "namespace:dotted.key" set a group of registered schemas will request:
 * field/placeholder/description keys under each entry's `ns`, and shared enum
 * keys under `enumNs`.
 */
export function expectedKeysFromSchemas(
  entries: SchemaEntry[],
  enumNs: string = defaultEnumNs,
): Set<string> {
  const expected = new Set<string>();
  for (const { schema, ns } of entries) {
    const { fieldKeys, placeholderKeys, descriptionKeys, enumKeys } = collectSchemaKeys(schema);
    for (const key of [...fieldKeys, ...placeholderKeys, ...descriptionKeys]) {
      expected.add(`${ns}:${key}`);
    }
    for (const key of enumKeys) {
      expected.add(`${enumNs}:${key}`);
    }
  }
  return expected;
}
