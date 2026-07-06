#!/usr/bin/env node
/* eslint-disable no-console -- a CLI's output IS the console */
// bota-gql-codegen --schema <dir> --out <dir> [--types-import <specifier>] [--money-type <name>]
//
// Reads every .graphql file under --schema (recursive, sorted for determinism),
// generates the five artifact files into --out, prints diagnostics, and exits
// non-zero when any diagnostic is an error. Pair it with @graphql-codegen/
// typescript, which emits the base types file the artifacts import.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { generateFromSdl } from "./generate";
import { collectSdl } from "./sdlFiles";
import type { Diagnostic } from "./model";

function formatDiagnostic(d: Diagnostic): string {
  return `${d.severity.toUpperCase().padEnd(7)} ${d.where}: ${d.message}`;
}

function main(): void {
  const { values } = parseArgs({
    options: {
      schema: { type: "string" },
      out: { type: "string" },
      "types-import": { type: "string" },
      "money-type": { type: "string" },
      quiet: { type: "boolean", default: false },
    },
  });

  if (!values.schema || !values.out) {
    console.error(
      "Usage: bota-gql-codegen --schema <sdl-dir> --out <out-dir> [--types-import ./types] [--money-type Money] [--quiet]",
    );
    process.exit(2);
  }

  const sdl = collectSdl(values.schema).join("\n");
  const { files, diagnostics } = generateFromSdl(sdl, {
    typesImportPath: values["types-import"],
    moneyTypeName: values["money-type"],
  });

  mkdirSync(values.out, { recursive: true });
  writeFileSync(join(values.out, "domainDefinitions.ts"), files.domainDefinitions);
  writeFileSync(join(values.out, "forms.ts"), files.forms);
  writeFileSync(join(values.out, "enums.ts"), files.enums);
  writeFileSync(join(values.out, "inputSchemas.ts"), files.inputSchemas);
  writeFileSync(join(values.out, "operations.ts"), files.operations);

  const errors = diagnostics.filter((d) => d.severity === "error");
  const reported = values.quiet ? errors : diagnostics;
  for (const d of reported) {
    console.error(formatDiagnostic(d));
  }
  console.log(
    `✓ generated domainDefinitions.ts, forms.ts, enums.ts, inputSchemas.ts, operations.ts` +
      (diagnostics.length ? ` (${diagnostics.length} diagnostics, ${errors.length} errors)` : ""),
  );
  process.exit(errors.length ? 1 : 0);
}

main();
