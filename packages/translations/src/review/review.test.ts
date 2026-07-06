import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runTranslationReview, TranslationReviewError } from "./index";

// The test provides an empty baseline up-front, so no `generate` seed path runs
// and the tool never shells out to git — the review is exercised purely over the
// tmp fixture files.
let dir: string;
let localesDir: string;
let baselinePath: string;
let outDir: string;

const opts = () => ({
  localesDir,
  baselinePath,
  outDir,
  outBasename: "demo.review",
  appLabel: "Demo",
  reviewLang: "am",
  mode: "generate" as const,
});

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "bota-translation-review-"));
  localesDir = join(dir, "locales");
  baselinePath = join(dir, "baseline.am.json");
  outDir = join(dir, "out");

  mkdirSync(join(localesDir, "am"), { recursive: true });
  mkdirSync(join(localesDir, "en"), { recursive: true });
  writeFileSync(
    join(localesDir, "am", "projects.json"),
    JSON.stringify({ fields: { status: "ሁኔታ", name: "ስም" } }),
  );
  writeFileSync(
    join(localesDir, "en", "projects.json"),
    JSON.stringify({ fields: { status: "Status", name: "Name" } }),
  );
  // A non-scope key must be excluded from the worksheet.
  writeFileSync(join(localesDir, "am", "misc.json"), JSON.stringify({ title: "ርዕስ" }));
  // Empty approved baseline → every in-scope am string is pending.
  writeFileSync(baselinePath, "{}\n");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("runTranslationReview", () => {
  it("generate lists every in-scope, not-yet-approved review string", () => {
    const { pending } = runTranslationReview(opts());
    expect(pending).toBe(2); // fields.status + fields.name; misc.title is out of scope

    const csv = readFileSync(join(outDir, "demo.review.csv"), "utf8");
    expect(csv).toContain("projects:fields.status");
    expect(csv).toContain("projects:fields.name");
    expect(csv).not.toContain("misc:title");
    expect(existsSync(join(outDir, "demo.review.md"))).toBe(true);
  });

  it("approve advances the baseline so nothing is pending afterwards", () => {
    runTranslationReview(opts());
    const approved = runTranslationReview({ ...opts(), mode: "approve" });
    expect(approved.pending).toBe(0);

    const after = runTranslationReview(opts());
    expect(after.pending).toBe(0);
  });

  it("check throws when the worksheet is stale", () => {
    runTranslationReview(opts());
    // Mutate a source string so the freshly-computed worksheet differs from disk.
    writeFileSync(
      join(localesDir, "am", "projects.json"),
      JSON.stringify({ fields: { status: "ተቀይሯል", name: "ስም" } }),
    );
    expect(() => runTranslationReview({ ...opts(), mode: "check" })).toThrow(
      TranslationReviewError,
    );
  });

  it("check passes when the worksheet is in sync", () => {
    runTranslationReview(opts());
    const { pending } = runTranslationReview({ ...opts(), mode: "check" });
    expect(pending).toBe(2);
  });
});
