#!/usr/bin/env node
/* eslint-disable no-console -- a CLI's output IS the console */
// bota-translation-review — generate/verify a translator-review worksheet.
//
//   bota-translation-review --locales <dir> --baseline <file> --out <dir> \
//     --basename <stem> --app <label> --lang <code> [--ref-lang <code>]
//   bota-translation-review ... --approve       mark current review lang as reviewed
//   bota-translation-review ... --check         fail (exit 1) if the worksheet is stale
//   bota-translation-review ... --seed-ref=<ref> (re)seed the baseline from a git ref
//
// Paths are resolved relative to the current working directory (the consuming
// repo), so git seed/verify runs against that repo.
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { runTranslationReview, TranslationReviewError, type TranslationReviewMode } from "./index";

function main(): void {
  const { values } = parseArgs({
    options: {
      locales: { type: "string" },
      baseline: { type: "string" },
      out: { type: "string" },
      basename: { type: "string" },
      app: { type: "string" },
      lang: { type: "string" },
      "ref-lang": { type: "string" },
      approve: { type: "boolean", default: false },
      check: { type: "boolean", default: false },
      "seed-ref": { type: "string" },
    },
  });

  const missing = (["locales", "baseline", "out", "basename", "app", "lang"] as const).filter(
    (flag) => !values[flag],
  );
  if (missing.length > 0) {
    console.error(`✗ Missing required flag(s): ${missing.map((f) => `--${f}`).join(", ")}`);
    process.exit(1);
  }

  const mode: TranslationReviewMode = values.approve
    ? "approve"
    : values.check
      ? "check"
      : "generate";

  try {
    runTranslationReview({
      localesDir: resolve(process.cwd(), values.locales ?? ""),
      baselinePath: resolve(process.cwd(), values.baseline ?? ""),
      outDir: resolve(process.cwd(), values.out ?? ""),
      outBasename: values.basename ?? "",
      appLabel: values.app ?? "",
      reviewLang: values.lang ?? "",
      referenceLang: values["ref-lang"],
      seedRef: values["seed-ref"],
      mode,
      onLog: (message) => console.log(message),
    });
  } catch (error) {
    if (error instanceof TranslationReviewError) {
      console.error(`✗ ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}

main();
