// Asserts every published JS entrypoint (package.json exports resolving into
// dist/) has a budget in .size-limit.json, so new packages and new subpaths
// cannot silently escape the `pnpm size` CI gate.
//
// Runs from the repo root: `node scripts/checkSizeLimitCoverage.mjs`.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const budgetedPaths = new Set(
  JSON.parse(readFileSync(join(repoRoot, ".size-limit.json"), "utf8")).map((entry) => entry.path),
);

/** The `default`/`import` target of an exports value, if it is a JS file in dist/. */
function distJsTarget(value) {
  if (typeof value === "string") {
    return value.startsWith("./dist/") && value.endsWith(".js") ? value : undefined;
  }
  if (value && typeof value === "object") {
    return distJsTarget(value.default ?? value.import);
  }
  return undefined;
}

const missing = [];
// Published package directories: everything under packages/, plus the
// root-level mocks workspace.
const packageDirs = [
  ...readdirSync(join(repoRoot, "packages")).map((name) => `packages/${name}`),
  "mocks",
];
for (const dir of packageDirs) {
  const packageJsonPath = join(repoRoot, dir, "package.json");
  if (!existsSync(packageJsonPath)) {
    continue;
  }
  const { exports: exportsMap } = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  for (const [subpath, value] of Object.entries(exportsMap ?? {})) {
    const target = distJsTarget(value);
    if (!target) {
      continue;
    }
    const sizeLimitPath = `${dir}/${target.slice(2)}`;
    if (!budgetedPaths.has(sizeLimitPath)) {
      missing.push(`${dir} "${subpath}" -> ${sizeLimitPath}`);
    }
  }
}

if (missing.length > 0) {
  console.error("checkSizeLimitCoverage: published entrypoints without a .size-limit.json budget:");
  for (const entry of missing) {
    console.error(`  - ${entry}`);
  }
  process.exit(1);
}
console.log("checkSizeLimitCoverage: every published dist entrypoint has a size budget");
