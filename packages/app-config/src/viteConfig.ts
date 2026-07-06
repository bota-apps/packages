import type { z } from "zod";

function camelToScreamingSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase();
}

// Vite built-in env vars that don't use the VITE_ prefix.
const viteBuiltins: Record<string, string> = {
  mode: "MODE",
};

/**
 * Resolves a Zod-validated config object from Vite env vars: each key of the
 * schema reads `VITE_<SCREAMING_SNAKE>` (`apiUrl` → `VITE_API_URL`), except Vite
 * builtins (`mode` → `MODE`). Throws when any required value is missing or
 * invalid — config fails fast at startup, never silently.
 *
 * @example
 * const env = createViteAppConfig(graphqlAppEnv, import.meta.env);
 */
export function createViteAppConfig<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  env: Record<string, string | undefined>,
): z.infer<T> {
  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(schema.shape)) {
    const envKey = viteBuiltins[key] ?? `VITE_${camelToScreamingSnake(key)}`;
    raw[key] = env[envKey];
  }
  return schema.parse(raw);
}
