import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { RouteCatalog } from "../routeSmoke/createRouteSmoke";

export type RouteCoverageConfig = {
  /** Absolute path to the app's TanStack file-route directory (`src/routes`). */
  routesDir: string;
  /** Absolute path to the directory holding `routeSmoke.<zone>.test.tsx` files. */
  testsDir: string;
  /** The app's route catalog (the one the smoke engine runs). */
  catalog: RouteCatalog;
  /** Seed entity ids used in parameterized catalog paths — normalized to `*`. */
  wildcardIds: Iterable<string>;
  /**
   * App-specific route files to exclude beyond the built-in TanStack
   * conventions (path relative to `routesDir`, `/`-separated) — e.g. a
   * catch-all that mounts an embedded extension app rather than an own page.
   */
  isExcluded?: (relativeFile: string) => boolean;
};

export type RouteCoverageReport = {
  /** Route-file shapes with no catalog entry — a page that would ship untested. */
  missingCatalogEntries: string[];
  /** Catalog-path shapes with no route file — a typo, or a moved/deleted route. */
  missingRouteFiles: string[];
  /** Catalog paths listed more than once. */
  duplicateCatalogPaths: string[];
  /** Catalog zones with no `routeSmoke.<zone>.test.tsx` — the zone never runs. */
  missingZoneTestFiles: string[];
};

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      out.push(...walk(full));
    } else if (entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

// Intentionally NOT navigable (excluded by convention):
//   - route.tsx        — zone layout / permission boundary (covered via children)
//   - __root.tsx       — the auth-guard shell
//   - index.tsx (root) — usually a redirect to the app's home zone
//   - X.tsx beside X.index.tsx — a flat-notation layout (covered by children)
function navigablePageFiles(config: RouteCoverageConfig): string[] {
  const all = walk(config.routesDir).map((file) =>
    file.slice(config.routesDir.length).replaceAll("\\", "/").replace(/^\//, ""),
  );
  const indexSiblings = new Set(
    all.filter((f) => f.endsWith(".index.tsx")).map((f) => f.replace(".index.tsx", ".tsx")),
  );
  return all
    .filter((f) => !/(^|\/)route\.tsx$/.test(f))
    .filter((f) => f !== "__root.tsx" && f !== "index.tsx")
    .filter((f) => !indexSiblings.has(f))
    .filter((f) => !(config.isExcluded?.(f) ?? false));
}

// A route file → its shape: "/employees/*/leave/*" with every `$param` segment
// as "*". Flat dot-notation (auditTrail.$entryId.tsx) expands to nested
// segments; a trailing "index" segment collapses onto its parent.
export function fileToShape(file: string): string {
  const segments = file
    .replace(/\.tsx$/, "")
    .replaceAll(".", "/")
    .split("/")
    .filter((s) => s !== "" && s !== "index")
    .map((s) => (s.startsWith("$") ? "*" : s));
  return `/${segments.join("/")}`;
}

// A concrete catalog path → its shape: any seed-id segment becomes "*".
export function pathToShape(path: string, wildcardIds: ReadonlySet<string>): string {
  const segments = path
    .split("/")
    .filter((s) => s !== "")
    .map((s) => (wildcardIds.has(s) ? "*" : s));
  return `/${segments.join("/")}`;
}

// Multiset difference: entries of `a` not matched one-for-one in `b`.
function diff(a: string[], b: string[]): string[] {
  const remaining = new Map<string, number>();
  for (const item of b) {
    remaining.set(item, (remaining.get(item) ?? 0) + 1);
  }
  return a.filter((item) => {
    const count = remaining.get(item) ?? 0;
    if (count > 0) {
      remaining.set(item, count - 1);
      return false;
    }
    return true;
  });
}

/**
 * Diffs the app's route files against its route catalog — both normalized to a
 * route SHAPE (`$param` / seed-id segments → `*`) and multiset-diffed in both
 * directions, so a mismatch names the exact route rather than two counts that
 * disagree. Also reports duplicate catalog paths and catalog zones missing
 * their `routeSmoke.<zone>.test.tsx` file.
 */
export function computeRouteCoverage(config: RouteCoverageConfig): RouteCoverageReport {
  const wildcardIds: ReadonlySet<string> = new Set(config.wildcardIds);
  const allPaths = Object.values(config.catalog).flat();

  const fileShapes = navigablePageFiles(config).map(fileToShape).sort();
  const catalogShapes = allPaths.map((path) => pathToShape(path, wildcardIds)).sort();

  const seen = new Set<string>();
  const duplicateCatalogPaths = allPaths.filter((path) => {
    if (seen.has(path)) {
      return true;
    }
    seen.add(path);
    return false;
  });

  return {
    missingCatalogEntries: diff(fileShapes, catalogShapes),
    missingRouteFiles: diff(catalogShapes, fileShapes),
    duplicateCatalogPaths,
    missingZoneTestFiles: Object.keys(config.catalog).filter(
      (zone) => !existsSync(join(config.testsDir, `routeSmoke.${zone}.test.tsx`)),
    ),
  };
}
