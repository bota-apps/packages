import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Every .graphql file under `dir`, recursive, sorted for deterministic output. */
export function collectSdl(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectSdl(full));
    } else if (entry.endsWith(".graphql")) {
      out.push(readFileSync(full, "utf8"));
    }
  }
  return out;
}
