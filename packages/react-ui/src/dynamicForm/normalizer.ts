import type { DynamicFieldSchema } from "@bota-apps/types";

function normalizeField(raw: unknown, type: DynamicFieldSchema["type"]): unknown {
  switch (type) {
    case "number":
    case "currency": {
      if (raw === "" || raw === undefined || raw === null) {
        return undefined;
      }
      return Number(raw);
    }
    case "checkbox":
    case "switch": {
      return Boolean(raw);
    }
    default: {
      if (raw === null || raw === undefined) {
        return undefined;
      }
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed === "" ? undefined : trimmed;
      }
      return raw;
    }
  }
}

export function normalizeFormValues<T extends Record<string, unknown>>(
  values: Record<string, unknown>,
  fields: readonly DynamicFieldSchema[],
): T {
  const overrides = Object.fromEntries(
    fields.map((field) => [field.name, normalizeField(values[field.name], field.type)]),
  );
  // The caller guarantees values matches T at runtime; the cast bridges the type boundary
  return { ...values, ...overrides } as T;
}
