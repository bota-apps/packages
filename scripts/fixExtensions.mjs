// tsc (module/moduleResolution = ESNext/bundler) emits extensionless relative
// imports. Bundlers resolve those, but Node ESM and "nodenext" consumers do not.
// This rewrites every relative specifier in dist/*.{js,d.ts} to a fully
// specified path ("./x" -> "./x.js" or "./x/index.js"), so the published package
// works for every consumer, not just bundler-based ones.
//
// Runs per-package via `node ../../scripts/fixExtensions.mjs`, so it resolves
// `dist` relative to the package being built — process.cwd() — not its own path.
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");

if (!existsSync(distDir)) {
  console.log(`fixExtensions: no dist/ in ${process.cwd()} — nothing to do`);
  process.exit(0);
}

/** Recursively collect .js and .d.ts files. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (full.endsWith(".js") || full.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

// Matches the specifier in `from "..."`, `import("...")`, and bare `import "..."`.
// Bare "." / ".." (no slash) are included — tsc synthesizes `import("..")` in
// d.ts files when it infers a type it can only name via the package barrel.
const specifierRe = /(\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.\.?(?:\/[^"']*)?)\2/g;

function resolveSpecifier(fileDir, spec) {
  if (/\.(js|mjs|cjs|json|css)$/.test(spec)) {
    return spec; // already explicit
  }
  const target = resolve(fileDir, spec);
  const hasFlat = existsSync(`${target}.js`);
  const hasDirectory = existsSync(join(target, "index.js"));
  // A fresh tsc build mirrors the source tree, where a module is either a
  // flat file or a directory — never both. Both existing means dist holds
  // stale output from before a file→directory move, and guessing here would
  // silently wire the barrel to the outdated module.
  if (hasFlat && hasDirectory) {
    throw new Error(
      `fixExtensions: both ${spec}.js and ${spec}/index.js exist under dist/ — ` +
        `stale build output. Run the package's clean script (rm -rf dist) and rebuild.`,
    );
  }
  if (hasFlat) {
    return `${spec}.js`;
  }
  if (hasDirectory) {
    return `${spec}/index.js`;
  }
  return spec; // leave untouched if we can't resolve it
}

let changedFiles = 0;
for (const file of walk(distDir)) {
  const fileDir = dirname(file);
  const original = readFileSync(file, "utf8");
  const updated = original.replace(specifierRe, (match, prefix, quote, spec) => {
    const fixed = resolveSpecifier(fileDir, spec);
    return fixed === spec ? match : `${prefix}${quote}${fixed}${quote}`;
  });
  if (updated !== original) {
    writeFileSync(file, updated);
    changedFiles += 1;
  }
}

console.log(`fixExtensions: rewrote relative imports in ${changedFiles} file(s)`);
