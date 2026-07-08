import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterAll, describe, expect, it } from "vitest";
import { computeRouteCoverage, fileToShape, pathToShape } from "./computeRouteCoverage";

// A fabricated TanStack route tree exercising every convention the guard
// understands: layouts, the root redirect, params, flat dot-notation, and a
// flat-notation layout sibling.
const fixture = join(tmpdir(), "bota-testing-coverage-fixture");
const routesDir = join(fixture, "routes");
const testsDir = join(fixture, "__tests__");

function touch(relative: string): void {
  const full = join(routesDir, relative);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, "");
}

rmSync(fixture, { recursive: true, force: true });
mkdirSync(testsDir, { recursive: true });
touch("__root.tsx"); // auth shell — excluded
touch("index.tsx"); // root redirect — excluded
touch("employees/route.tsx"); // zone layout — excluded
touch("employees/index.tsx");
touch("employees/$employeeId/index.tsx");
touch("employees/$employeeId/auditTrail.tsx"); // flat-notation layout sibling — excluded
touch("employees/$employeeId/auditTrail.index.tsx");
touch("employees/$employeeId/auditTrail.$entryId.tsx");
touch("apps/$appId.tsx"); // app-specific exclusion (embedded extension host)
writeFileSync(join(testsDir, "routeSmoke.employees.test.tsx"), "");

afterAll(() => rmSync(fixture, { recursive: true, force: true }));

const catalog = {
  employees: [
    "/employees",
    "/employees/emp_001",
    "/employees/emp_001/auditTrail",
    "/employees/emp_001/auditTrail/audit_001",
  ],
};
const wildcardIds = ["emp_001", "audit_001"];
const isExcluded = (file: string) => file.startsWith("apps/");

describe("computeRouteCoverage", () => {
  it("reports a clean tree/catalog pair as fully covered", () => {
    const report = computeRouteCoverage({ routesDir, testsDir, catalog, wildcardIds, isExcluded });
    expect(report).toEqual({
      missingCatalogEntries: [],
      missingRouteFiles: [],
      duplicateCatalogPaths: [],
      missingZoneTestFiles: [],
    });
  });

  it("names a route file the catalog misses", () => {
    touch("employees/new.tsx");
    const report = computeRouteCoverage({ routesDir, testsDir, catalog, wildcardIds, isExcluded });
    rmSync(join(routesDir, "employees/new.tsx"));
    expect(report.missingCatalogEntries).toEqual(["/employees/new"]);
  });

  it("names a catalog path with no route file, duplicates, and a zone with no smoke file", () => {
    const report = computeRouteCoverage({
      routesDir,
      testsDir,
      catalog: {
        employees: [...catalog.employees, "/employees/typo", "/employees"],
        reports: ["/reports"],
      },
      wildcardIds,
      isExcluded,
    });
    expect(report.missingRouteFiles).toEqual(["/employees", "/employees/typo", "/reports"]);
    expect(report.duplicateCatalogPaths).toEqual(["/employees"]);
    expect(report.missingZoneTestFiles).toEqual(["reports"]);
  });
});

describe("shape normalization", () => {
  it("expands flat dot-notation and collapses trailing index segments", () => {
    expect(fileToShape("employees/$employeeId/auditTrail.$entryId.tsx")).toBe(
      "/employees/*/auditTrail/*",
    );
    expect(fileToShape("employees/index.tsx")).toBe("/employees");
  });

  it("wildcards seed-id segments only", () => {
    expect(pathToShape("/employees/emp_001/auditTrail", new Set(["emp_001"]))).toBe(
      "/employees/*/auditTrail",
    );
  });
});
