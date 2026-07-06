// Reusable translation-review worksheet generator (Node only). Generalizes the
// app-local script that produced a CSV + Markdown worksheet of not-yet-approved
// locale strings for a native reviewer, diffing the review language against a
// git-seeded, then approval-advanced, baseline.
//
// "Needs review" = a review-language string whose value differs from the
// approved baseline (or is absent from it). Scope defaults to the shared `enums`
// namespace plus every `fields.*` / `placeholders.*` / `descriptions.*` key (the
// generated-field surface); callers can pass their own predicate.
//
// This module is Node-only (fs + git) and is exposed on the `./review` subpath +
// the `bota-translation-review` bin — never from the package's browser entry.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, relative } from "node:path";

/** Which `(namespace, dotted-key)` pairs count as review surface. */
export type ReviewScope = (namespace: string, key: string) => boolean;

export type TranslationReviewMode = "generate" | "approve" | "check";

export type TranslationReviewOptions = {
  /** Absolute path to the locale root holding one dir per language. */
  localesDir: string;
  /** Absolute path to the approved-baseline JSON file. */
  baselinePath: string;
  /** Absolute path to the directory the worksheet is written into. */
  outDir: string;
  /** Worksheet file stem, e.g. `"tasks.amharic-review"` → `<stem>.csv` / `<stem>.md`. */
  outBasename: string;
  /** Human app label used in the Markdown heading, e.g. `"Tasks"`. */
  appLabel: string;
  /** Language being reviewed, e.g. `"am"`. */
  reviewLang: string;
  /** Reference language shown alongside, default `"en"`. */
  referenceLang?: string;
  /** In-scope predicate; defaults to enums namespace + `fields|placeholders|descriptions.*`. */
  scope?: ReviewScope;
  /** What to do: regenerate the worksheet, approve the current state, or verify freshness. */
  mode: TranslationReviewMode;
  /** `--seed-ref` git ref to (re)seed the approved baseline from that ref's review-language state. */
  seedRef?: string;
  /** Optional sink for the human-readable progress messages the CLI prints. */
  onLog?: (message: string) => void;
};

export type TranslationReviewResult = {
  /** Number of strings pending native review. */
  pending: number;
};

/** Thrown for the CLI-fatal conditions (missing baseline, stale worksheet). */
export class TranslationReviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranslationReviewError";
  }
}

const defaultScope: ReviewScope = (namespace, key) =>
  namespace === "enums" || /^(fields|placeholders|descriptions)\./u.test(key);

type FlatBundle = Record<string, string>;

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// namespace = file path under a locale root, minus ".json" and a trailing "/index".
function namespaceOf(fileAbs: string, langRoot: string): string {
  const rel = relative(langRoot, fileAbs)
    .replace(/\\/gu, "/")
    .replace(/\.json$/u, "");
  return rel.replace(/\/index$/u, "");
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      out.push(...walk(abs));
    } else if (entry.endsWith(".json")) {
      out.push(abs);
    }
  }
  return out;
}

function flatten(obj: unknown, prefix: string, sink: FlatBundle): void {
  if (!isStringRecord(obj)) {
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") {
      sink[key] = v;
    } else if (isStringRecord(v)) {
      flatten(v, key, sink);
    }
  }
}

function parseJson(raw: string): unknown {
  return JSON.parse(raw);
}

// Resolve the enclosing git repo root once, lazily (only seed paths need it).
function gitRepoRoot(cwd: string): string {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd }).toString().trim();
}

// { "ns:dotted.key": value } for the in-scope keys of one language, from disk.
function scopedBundle(localesDir: string, lang: string, scope: ReviewScope): FlatBundle {
  const root = join(localesDir, lang);
  const map: FlatBundle = {};
  if (!existsSync(root)) {
    return map;
  }
  for (const file of walk(root)) {
    const ns = namespaceOf(file, root);
    const flat: FlatBundle = {};
    flatten(parseJson(readFileSync(file, "utf8")), "", flat);
    for (const [key, value] of Object.entries(flat)) {
      if (scope(ns, key)) {
        map[`${ns}:${key}`] = value;
      }
    }
  }
  return map;
}

// Same shape, but reading each review-language file's version at a git ref.
function scopedBundleAtRef(
  localesDir: string,
  reviewLang: string,
  ref: string,
  scope: ReviewScope,
  repoRoot: string,
): FlatBundle {
  const root = join(localesDir, reviewLang);
  const map: FlatBundle = {};
  if (!existsSync(root)) {
    return map;
  }
  for (const file of walk(root)) {
    const ns = namespaceOf(file, root);
    const pathspec = `${ref}:${relative(repoRoot, file).replace(/\\/gu, "/")}`;
    let raw: string;
    try {
      raw = execFileSync("git", ["show", pathspec], {
        cwd: repoRoot,
        stdio: ["ignore", "pipe", "ignore"],
      }).toString();
    } catch {
      continue; // file is new at HEAD → nothing approved yet
    }
    const flat: FlatBundle = {};
    flatten(parseJson(raw), "", flat);
    for (const [key, value] of Object.entries(flat)) {
      if (scope(ns, key)) {
        map[`${ns}:${key}`] = value;
      }
    }
  }
  return map;
}

function writeBaseline(baselinePath: string, map: FlatBundle): void {
  mkdirSync(dirname(baselinePath), { recursive: true });
  const sorted: FlatBundle = {};
  for (const k of Object.keys(map).sort()) {
    sorted[k] = map[k];
  }
  writeFileSync(baselinePath, `${JSON.stringify(sorted, null, 2)}\n`);
}

function loadBaseline(
  opts: Required<Pick<TranslationReviewOptions, "localesDir" | "baselinePath" | "reviewLang">> & {
    scope: ReviewScope;
    seedRef?: string;
    seedIfMissing: boolean;
    log: (message: string) => void;
  },
): FlatBundle {
  const { localesDir, baselinePath, reviewLang, scope, seedRef, seedIfMissing, log } = opts;
  if (seedRef) {
    const repoRoot = gitRepoRoot(localesDir);
    const seed = scopedBundleAtRef(localesDir, reviewLang, seedRef, scope, repoRoot);
    writeBaseline(baselinePath, seed);
    log(`Seeded baseline from ${seedRef} (${Object.keys(seed).length} approved keys).`);
    return seed;
  }
  if (existsSync(baselinePath)) {
    const parsed = parseJson(readFileSync(baselinePath, "utf8"));
    return isStringRecord(parsed) ? flattenTop(parsed) : {};
  }
  if (!seedIfMissing) {
    throw new TranslationReviewError(
      `Baseline missing: ${baselinePath}\n  Generate the worksheet first (and commit it).`,
    );
  }
  const repoRoot = gitRepoRoot(localesDir);
  const seed = scopedBundleAtRef(localesDir, reviewLang, "HEAD", scope, repoRoot);
  writeBaseline(baselinePath, seed);
  log(`Seeded baseline from git HEAD (${Object.keys(seed).length} approved keys).`);
  return seed;
}

// Baseline files are already flat ("ns:key" → value); keep only string leaves.
function flattenTop(obj: Record<string, unknown>): FlatBundle {
  const out: FlatBundle = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      out[k] = v;
    }
  }
  return out;
}

type PendingRow = {
  id: string;
  ns: string;
  key: string;
  reference: string;
  review: string;
  status: "new" | "changed";
};

function pendingRows(
  review: FlatBundle,
  reference: FlatBundle,
  baseline: FlatBundle,
): PendingRow[] {
  const rows: PendingRow[] = [];
  for (const id of Object.keys(review).sort()) {
    const status = !(id in baseline) ? "new" : baseline[id] !== review[id] ? "changed" : undefined;
    if (status) {
      const sep = id.indexOf(":");
      rows.push({
        id,
        ns: id.slice(0, sep),
        key: id.slice(sep + 1),
        reference: reference[id] ?? "",
        review: review[id],
        status,
      });
    }
  }
  return rows;
}

const csvCell = (s: string): string => `"${s.replace(/"/gu, '""')}"`;

function renderCsv(rows: PendingRow[]): string {
  const header = ["id", "namespace", "key", "reference", "review_machine", "corrected", "status"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([r.id, r.ns, r.key, r.reference, r.review, "", r.status].map(csvCell).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function renderMd(rows: PendingRow[], appLabel: string, reviewLang: string): string {
  const byNs = new Map<string, PendingRow[]>();
  for (const r of rows) {
    const bucket = byNs.get(r.ns) ?? [];
    bucket.push(r);
    byNs.set(r.ns, bucket);
  }
  const out: string[] = [];
  out.push(`# ${appLabel} — ${reviewLang} translation review`);
  out.push("");
  out.push(
    `**${rows.length} string(s) pending native review.** Generated by \`bota-translation-review\` — do not edit by hand.`,
  );
  out.push("");
  out.push(
    "Workflow: review the machine value, put your correction in the **Corrected** column " +
      "(or directly in the matching locale file), then a maintainer runs the tool with `--approve` " +
      "to clear reviewed rows. `status`: `new` = no prior translation; `changed` = value changed " +
      "since last approval.",
  );
  out.push("");
  const esc = (s: string): string => s.replace(/\|/gu, "\\|").replace(/\n/gu, " ");
  for (const ns of [...byNs.keys()].sort()) {
    out.push(`## ${ns}`);
    out.push("");
    out.push("| Key | Reference | Machine | Corrected | status |");
    out.push("| --- | --- | --- | --- | --- |");
    for (const r of byNs.get(ns) ?? []) {
      out.push(`| \`${esc(r.key)}\` | ${esc(r.reference)} | ${esc(r.review)} |  | ${r.status} |`);
    }
    out.push("");
  }
  return out.join("\n");
}

/**
 * Runs one review operation. `generate` (re)writes the worksheet (seeding the
 * baseline from git HEAD when absent); `approve` advances the baseline to the
 * current review-language state and clears the worksheet; `check` throws a
 * {@link TranslationReviewError} when the on-disk worksheet is stale. Returns the
 * pending-string count. Throws on a missing baseline (non-generate modes) or a
 * stale worksheet — the caller (CLI) maps those to a non-zero exit.
 */
export function runTranslationReview(options: TranslationReviewOptions): TranslationReviewResult {
  const {
    localesDir,
    baselinePath,
    outDir,
    outBasename,
    appLabel,
    reviewLang,
    referenceLang = "en",
    scope = defaultScope,
    mode,
    seedRef,
    onLog,
  } = options;
  const log = onLog ?? (() => {});
  const csvPath = join(outDir, `${outBasename}.csv`);
  const mdPath = join(outDir, `${outBasename}.md`);

  const review = scopedBundle(localesDir, reviewLang, scope);
  const reference = scopedBundle(localesDir, referenceLang, scope);

  if (mode === "approve") {
    writeBaseline(baselinePath, review);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(csvPath, renderCsv([]));
    writeFileSync(mdPath, renderMd([], appLabel, reviewLang));
    log(
      `Approved ${Object.keys(review).length} ${reviewLang} keys as the new baseline. Worksheet cleared.`,
    );
    return { pending: 0 };
  }

  const baseline = loadBaseline({
    localesDir,
    baselinePath,
    reviewLang,
    scope,
    seedRef,
    seedIfMissing: mode === "generate",
    log,
  });
  const rows = pendingRows(review, reference, baseline);
  const csv = renderCsv(rows);
  const md = renderMd(rows, appLabel, reviewLang);

  if (mode === "check") {
    const stale =
      !existsSync(csvPath) ||
      readFileSync(csvPath, "utf8") !== csv ||
      !existsSync(mdPath) ||
      readFileSync(mdPath, "utf8") !== md;
    if (stale) {
      throw new TranslationReviewError(
        `${appLabel} ${reviewLang} review worksheet is out of date with the locale files.\n` +
          `  Regenerate it and commit ${outBasename}.{csv,md}.`,
      );
    }
    log(`${appLabel} ${reviewLang} review worksheet is in sync (${rows.length} pending).`);
    return { pending: rows.length };
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(csvPath, csv);
  writeFileSync(mdPath, md);
  log(`Wrote ${rows.length} pending row(s) to:\n  ${csvPath}\n  ${mdPath}`);
  return { pending: rows.length };
}
