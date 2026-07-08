// Node-side coverage guard for the route-smoke suite — a newly added route
// cannot ship untested. Use from a `// @vitest-environment node` test file:
//
//   describeRouteCoverage({ routesDir, testsDir, catalog: routeCatalog, wildcardIds: Object.values(seedIds) });
import { describe, expect, it } from "vitest";
import { computeRouteCoverage, type RouteCoverageConfig } from "./computeRouteCoverage";

export { computeRouteCoverage, fileToShape, pathToShape } from "./computeRouteCoverage";
export type { RouteCoverageConfig, RouteCoverageReport } from "./computeRouteCoverage";

/** Registers the coverage-guard suite; each failure names the exact route/zone. */
export function describeRouteCoverage(config: RouteCoverageConfig): void {
  describe("route smoke coverage", () => {
    const report = computeRouteCoverage(config);

    it("has a catalog entry for every navigable route file", () => {
      expect(
        report.missingCatalogEntries,
        "route files with no catalog entry — add them to the route catalog",
      ).toEqual([]);
    });

    it("has a route file for every catalog entry", () => {
      expect(
        report.missingRouteFiles,
        "catalog paths with no route file — typo, or the route was moved/deleted",
      ).toEqual([]);
    });

    it("has no duplicate paths in the catalog", () => {
      expect(report.duplicateCatalogPaths).toEqual([]);
    });

    it("has a smoke test file executing every catalog zone", () => {
      expect(
        report.missingZoneTestFiles,
        "catalog zones with no routeSmoke.<zone>.test.tsx — the zone would never run",
      ).toEqual([]);
    });
  });
}
