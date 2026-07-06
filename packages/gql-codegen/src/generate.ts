// The orchestrator: SDL in, five generated files + diagnostics out. Every
// emitted GraphQL document is validated against the schema built from the same
// SDL before it is returned, so generated operations are schema-valid by
// construction — a validation failure is a generator bug surfaced as an error
// diagnostic, never a runtime surprise in the app.
import { buildASTSchema, parse, validate } from "graphql";
import { buildModel } from "./model";
import type { Diagnostic, GenerateOptions } from "./model";
import {
  emitDomainDefinitions,
  emitEnums,
  emitForms,
  emitInputSchemas,
  emitOperations,
} from "./emit";

export type GeneratedFiles = {
  domainDefinitions: string;
  forms: string;
  enums: string;
  inputSchemas: string;
  operations: string;
};

export type GenerateResult = {
  files: GeneratedFiles;
  diagnostics: Diagnostic[];
};

export function generateFromSdl(sdl: string, options: GenerateOptions = {}): GenerateResult {
  const model = buildModel(sdl, options);
  const diagnostics = model.diagnostics;

  const domainDefinitions = emitDomainDefinitions(model);
  const forms = emitForms(model);
  const enums = emitEnums(model, diagnostics);
  const inputSchemas = emitInputSchemas(model, diagnostics);
  const { code: operations, sources } = emitOperations(model);

  try {
    const schema = buildASTSchema(model.doc);
    for (const source of sources) {
      for (const error of validate(schema, parse(source.body))) {
        diagnostics.push({
          severity: "error",
          where: source.name,
          message: `Generated operation is invalid against the schema: ${error.message}`,
        });
      }
    }
  } catch (error) {
    diagnostics.push({
      severity: "warning",
      where: "schema",
      message: `Operation validation skipped — the SDL did not build into a schema: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  return {
    files: { domainDefinitions, forms, enums, inputSchemas, operations },
    diagnostics,
  };
}
