// TS emitters — turn the SdlModel into the five generated files. None of the
// output is @ts-nocheck: emitted `satisfies` clauses check every definition
// against the generated base types, so an SDL rename, a missing enum value, or
// an invalid Badge tone fails the host app's `tsc`.
import { Kind } from "graphql";
import type { EnumTypeDefinitionNode, InputValueDefinitionNode, TypeNode } from "graphql";
import type { Diagnostic, EntityModel, RootFieldModel, SdlModel } from "./model";
import { directive, isListType, isRequired, lcFirst, numberArg, stringArg, ucFirst } from "./model";
import { humanize } from "./humanize";

// ── TS literal helpers ───────────────────────────────────────────────────────

const lit = (v: unknown): string => (typeof v === "string" ? JSON.stringify(v) : String(v));

/** Pretty-print a plain JS value as a deterministic TS literal (2-space indent). */
function tsLiteral(value: unknown, level = 0): string {
  const pad = "  ".repeat(level);
  const pad1 = "  ".repeat(level + 1);
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return `[\n${value.map((v) => pad1 + tsLiteral(v, level + 1)).join(",\n")}\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) {
      return "{}";
    }
    return `{\n${entries.map(([k, v]) => `${pad1}${k}: ${tsLiteral(v, level + 1)}`).join(",\n")}\n${pad}}`;
  }
  return lit(value);
}

function banner(): string {
  return (
    "// Generated from the domain SDL by @bota-apps/gql-codegen.\n" +
    "// Do not edit — re-run your app's `schema:gen` script.\n\n"
  );
}

const emptyFile = (): string => banner() + "export {};\n";

// ── Domain definitions ───────────────────────────────────────────────────────

type EntityArtifacts = {
  hasEntityDefinition: boolean;
  hasCreateDefinition: boolean;
  hasUpdateDefinition: boolean;
  hasFullDefinition: boolean;
};

export function entityArtifacts(e: EntityModel): EntityArtifacts {
  const hasEntityDefinition = e.entityFields.length > 0;
  const hasCreateDefinition = Boolean(e.createInput?.supported && e.createInput.fields.length);
  const hasUpdateDefinition = Boolean(e.updateInput?.supported && e.updateInput.fields.length);
  return {
    hasEntityDefinition,
    hasCreateDefinition,
    hasUpdateDefinition,
    hasFullDefinition: hasEntityDefinition && hasCreateDefinition,
  };
}

export function emitDomainDefinitions(model: SdlModel): string {
  const { entities, options } = model;
  const typeImports = new Set<string>();
  const contractImports = new Set<string>();
  const blocks: string[] = [];
  const registry: Array<[string, string]> = [];

  for (const e of entities) {
    const { entity, base, entityFields } = e;
    const artifacts = entityArtifacts(e);

    if (artifacts.hasEntityDefinition) {
      typeImports.add(entity);
      contractImports.add("EntityDefinition");
      const definition = {
        name: entity,
        graphqlTypeName: entity,
        detailId: `${base}-detail`,
        title: humanize(entity),
        fields: entityFields,
      };
      blocks.push(
        `export const ${base}EntityDefinition = ${tsLiteral(definition)} satisfies EntityDefinition<${entity}>;`,
      );
    }

    if (artifacts.hasCreateDefinition && e.createInput) {
      const inputName = e.createInput.graphqlInputName;
      typeImports.add(inputName);
      contractImports.add("CreateInputDefinition");
      const definition = {
        name: inputName,
        graphqlInputName: inputName,
        formId: `${base}-create`,
        formKey: `${base}-create`,
        title: `New ${humanize(entity).toLowerCase()}`,
        fields: e.createInput.fields,
      };
      blocks.push(
        `export const ${base}CreateDefinition = ${tsLiteral(definition)} satisfies CreateInputDefinition<${inputName}>;`,
      );
    }

    if (artifacts.hasUpdateDefinition && e.updateInput) {
      const inputName = e.updateInput.graphqlInputName;
      typeImports.add(inputName);
      contractImports.add("CreateInputDefinition");
      const definition = {
        name: inputName,
        graphqlInputName: inputName,
        formId: `${base}-update`,
        formKey: `${base}-update`,
        title: `Edit ${humanize(entity).toLowerCase()}`,
        fields: e.updateInput.fields,
      };
      blocks.push(
        `export const ${base}UpdateDefinition = ${tsLiteral(definition)} satisfies CreateInputDefinition<${inputName}>;`,
      );
    }

    if (artifacts.hasFullDefinition && e.createInput) {
      contractImports.add("DomainDefinition");
      blocks.push(
        `export const ${base}Definition = {\n` +
          `  name: ${lit(base)},\n` +
          `  entity: ${base}EntityDefinition,\n` +
          `  createInput: ${base}CreateDefinition,\n` +
          `} satisfies DomainDefinition<${e.entity}, ${e.createInput.graphqlInputName}>;`,
      );
      registry.push([base, `${base}Definition`]);
    }
  }

  // Action-mutation input forms reuse the create-input definition shape.
  for (const a of model.actionForms) {
    if (!a.supported || !a.fields.length) {
      continue;
    }
    typeImports.add(a.graphqlInputName);
    contractImports.add("CreateInputDefinition");
    const definition = {
      name: a.graphqlInputName,
      graphqlInputName: a.graphqlInputName,
      formId: a.mutationName,
      formKey: a.mutationName,
      title: humanize(a.mutationName),
      fields: a.fields,
    };
    blocks.push(
      `export const ${a.mutationName}Definition = ${tsLiteral(definition)} satisfies CreateInputDefinition<${a.graphqlInputName}>;`,
    );
  }

  // Standalone @detailView types get an entity definition for their detail schema.
  for (const dv of model.detailViews) {
    typeImports.add(dv.typeName);
    contractImports.add("EntityDefinition");
    const definition = {
      name: dv.typeName,
      graphqlTypeName: dv.typeName,
      detailId: `${dv.base}-detail`,
      title: humanize(dv.typeName),
      fields: dv.fields,
    };
    blocks.push(
      `export const ${dv.base}EntityDefinition = ${tsLiteral(definition)} satisfies EntityDefinition<${dv.typeName}>;`,
    );
  }

  if (!blocks.length) {
    return emptyFile();
  }

  const imports = [
    `import type { ${[...typeImports].sort().join(", ")} } from "${options.typesImportPath}";`,
    `import type { ${[...contractImports].sort().join(", ")} } from "@bota-apps/types";`,
  ];
  const parts = [banner() + imports.join("\n"), ...blocks];
  if (registry.length) {
    parts.push(
      `export const domainDefinitions = {\n${registry.map(([k, v]) => `  ${k}: ${v},`).join("\n")}\n};`,
    );
  }
  return parts.join("\n\n") + "\n";
}

// ── Forms ────────────────────────────────────────────────────────────────────

export function emitForms(model: SdlModel): string {
  const { entities, options } = model;
  const typeImports = new Set<string>();
  const contractImports = new Set<string>();
  const builderImports = new Set<string>();
  const defImports = new Set<string>();
  const schemaImports = new Set<string>();
  const optionImports = new Set<string>();
  const blocks: string[] = [];

  for (const e of entities) {
    const { entity, base, optionKeys } = e;
    const artifacts = entityArtifacts(e);
    const optionsObj = optionKeys.length ? `{ ${optionKeys.join(", ")} }` : undefined;
    optionKeys.forEach((k) => optionImports.add(k));

    const inputForm = (kind: "create" | "update", inputName: string): void => {
      typeImports.add(inputName);
      contractImports.add("TypedRegistrationSchema");
      builderImports.add("buildCreateFormSchema");
      defImports.add(`${base}${ucFirst(kind)}Definition`);
      schemaImports.add(`${lcFirst(inputName)}Schema`);
      const arg = optionsObj
        ? `{ inputSchema: ${lcFirst(inputName)}Schema, options: ${optionsObj} }`
        : `{ inputSchema: ${lcFirst(inputName)}Schema }`;
      blocks.push(
        `export function ${kind}${entity}FormSchema(): TypedRegistrationSchema<${inputName}> {\n` +
          `  return buildCreateFormSchema(${base}${ucFirst(kind)}Definition, ${arg});\n}`,
      );
    };

    if (artifacts.hasCreateDefinition && e.createInput) {
      inputForm("create", e.createInput.graphqlInputName);
    }
    if (artifacts.hasUpdateDefinition && e.updateInput) {
      inputForm("update", e.updateInput.graphqlInputName);
    }
    if (artifacts.hasEntityDefinition) {
      typeImports.add(entity);
      contractImports.add("TypedDetailSchema");
      builderImports.add("buildDetailSchema");
      defImports.add(`${base}EntityDefinition`);
      const detailArg = optionsObj ? `, { options: ${optionsObj} }` : "";
      blocks.push(
        `export function ${base}DetailSchema(): TypedDetailSchema<${entity}> {\n` +
          `  return buildDetailSchema(${base}EntityDefinition${detailArg});\n}`,
      );
    }
  }

  // Action-mutation input forms — same builder as entity create forms.
  for (const a of model.actionForms) {
    if (!a.supported || !a.fields.length) {
      continue;
    }
    typeImports.add(a.graphqlInputName);
    contractImports.add("TypedRegistrationSchema");
    builderImports.add("buildCreateFormSchema");
    defImports.add(`${a.mutationName}Definition`);
    schemaImports.add(`${lcFirst(a.graphqlInputName)}Schema`);
    a.optionKeys.forEach((k) => optionImports.add(k));
    const optionsObj = a.optionKeys.length ? `{ ${a.optionKeys.join(", ")} }` : undefined;
    const arg = optionsObj
      ? `{ inputSchema: ${lcFirst(a.graphqlInputName)}Schema, options: ${optionsObj} }`
      : `{ inputSchema: ${lcFirst(a.graphqlInputName)}Schema }`;
    blocks.push(
      `export function ${a.mutationName}FormSchema(): TypedRegistrationSchema<${a.graphqlInputName}> {\n` +
        `  return buildCreateFormSchema(${a.mutationName}Definition, ${arg});\n}`,
    );
  }

  // Detail schemas for standalone @detailView types (non-entity projections).
  for (const dv of model.detailViews) {
    typeImports.add(dv.typeName);
    contractImports.add("TypedDetailSchema");
    builderImports.add("buildDetailSchema");
    defImports.add(`${dv.base}EntityDefinition`);
    dv.optionKeys.forEach((k) => optionImports.add(k));
    const optionsObj = dv.optionKeys.length ? `{ ${dv.optionKeys.join(", ")} }` : undefined;
    const detailArg = optionsObj ? `, { options: ${optionsObj} }` : "";
    blocks.push(
      `export function ${dv.base}DetailSchema(): TypedDetailSchema<${dv.typeName}> {\n` +
        `  return buildDetailSchema(${dv.base}EntityDefinition${detailArg});\n}`,
    );
  }

  if (!blocks.length) {
    return emptyFile();
  }

  const imports = [
    `import type { ${[...typeImports].sort().join(", ")} } from "${options.typesImportPath}";`,
    `import type { ${[...contractImports].sort().join(", ")} } from "@bota-apps/types";`,
    `import { ${[...builderImports].sort().join(", ")} } from "@bota-apps/schema-utils";`,
    `import { ${[...defImports].sort().join(", ")} } from "./domainDefinitions";`,
  ];
  if (schemaImports.size) {
    imports.push(`import { ${[...schemaImports].sort().join(", ")} } from "./inputSchemas";`);
  }
  if (optionImports.size) {
    imports.push(`import { ${[...optionImports].sort().join(", ")} } from "./enums";`);
  }
  return banner() + imports.join("\n") + "\n\n" + blocks.join("\n\n") + "\n";
}

// ── Enums ────────────────────────────────────────────────────────────────────

export function emitEnums(model: SdlModel, diagnostics: Diagnostic[]): string {
  const { enums, options } = model;
  if (!enums.length) {
    return emptyFile();
  }

  const typeImports: string[] = [];
  let usesTone = false;
  const blocks: string[] = [];

  for (const e of enums) {
    const name = e.name.value;
    if (!e.values?.length) {
      diagnostics.push({
        severity: "error",
        where: name,
        message: "Enum has no values — cannot generate options.",
      });
      continue;
    }
    typeImports.push(name);
    const base = lcFirst(name);
    const values = e.values.map((v) => {
      const dir = (v.directives ?? []).find((d) => d.name.value === "display");
      const label = dir ? stringArgOnEnum(dir, "label") : undefined;
      const tone = dir ? stringArgOnEnum(dir, "tone") : undefined;
      return { value: v.name.value, label: label ?? humanize(v.name.value), tone };
    });

    const allToned = values.every((v) => v.tone !== undefined);
    const anyToned = values.some((v) => v.tone !== undefined);
    if (anyToned) {
      usesTone = true;
    }

    const metaEntries = values
      .map((v) => {
        const tonePart = v.tone !== undefined ? `, tone: ${lit(v.tone)}` : "";
        return `  ${v.value}: { label: ${lit(v.label)}${tonePart} },`;
      })
      .join("\n");
    const metaType = anyToned
      ? `Record<${name}, { label: string; tone${allToned ? "" : "?"}: BadgeTone }>`
      : `Record<${name}, { label: string }>`;
    blocks.push(`export const ${base}Meta = {\n${metaEntries}\n} satisfies ${metaType};`);

    const optionEntries = values
      .map((v) => `  { label: ${lit(v.label)}, value: ${lit(v.value)} },`)
      .join("\n");
    blocks.push(`export const ${base}Options: DynamicFieldOption[] = [\n${optionEntries}\n];`);
  }

  if (!blocks.length) {
    return emptyFile();
  }

  const imports = [
    `import type { ${typeImports.sort().join(", ")} } from "${options.typesImportPath}";`,
  ];
  if (usesTone) {
    imports.push(`import type { BadgeTone } from "@bota-apps/types";`);
  }
  imports.push(`import type { DynamicFieldOption } from "@bota-apps/types";`);
  return banner() + imports.join("\n") + "\n\n" + blocks.join("\n\n") + "\n";
}

type EnumValueDirective = NonNullable<
  NonNullable<EnumTypeDefinitionNode["values"]>[number]["directives"]
>[number];

function stringArgOnEnum(dir: EnumValueDirective, argName: string): string | undefined {
  const arg = (dir.arguments ?? []).find((a) => a.name.value === argName);
  if (arg && arg.value.kind === Kind.STRING) {
    return arg.value.value;
  }
  return undefined;
}

// ── Zod input schemas ────────────────────────────────────────────────────────

/**
 * Directive-aware Zod for every entity create/update input and each input
 * object type they reference (nested value objects, list elements). Schemas are
 * emitted in dependency order; a reference cycle degrades to z.unknown() with a
 * diagnostic.
 */
export function emitInputSchemas(model: SdlModel, diagnostics: Diagnostic[]): string {
  const { enums, entities, inputs, enumNames } = model;
  const blocks: string[] = [];

  for (const e of enums) {
    const vals = (e.values ?? []).map((v) => lit(v.name.value)).join(", ");
    blocks.push(`export const ${lcFirst(e.name.value)}Schema = z.enum([${vals}]);`);
  }

  // Dependency-ordered emission of every reachable input object.
  const emitted = new Set<string>();
  const inProgress = new Set<string>();
  const inputBlocks: string[] = [];

  const zodForType = (
    typeNode: TypeNode,
    field: InputValueDefinitionNode,
    where: string,
  ): string => {
    if (typeNode.kind === Kind.NON_NULL_TYPE) {
      return zodForType(typeNode.type, field, where);
    }
    if (typeNode.kind === Kind.LIST_TYPE) {
      return `z.array(${zodForType(typeNode.type, field, where)})`;
    }
    const typeName = typeNode.name.value;
    if (enumNames.has(typeName)) {
      return `${lcFirst(typeName)}Schema`;
    }
    if (typeName === "Boolean") {
      return "z.boolean()";
    }
    if (typeName === "Int" || typeName === "Float") {
      let expr = "z.number()";
      const min = numberArg(directive(field, "min"), "value");
      const max = numberArg(directive(field, "max"), "value");
      if (min !== undefined) {
        expr += `.min(${min})`;
      }
      if (max !== undefined) {
        expr += `.max(${max})`;
      }
      return expr;
    }
    if (typeName === "ID" || typeName === "String") {
      let expr = "z.string()";
      const widget = stringArg(directive(field, "widget"), "type");
      const minLength = numberArg(directive(field, "minLength"), "value");
      const maxLength = numberArg(directive(field, "maxLength"), "value");
      const pattern = stringArg(directive(field, "pattern"), "value");
      if (widget === "email") {
        expr += ".email()";
      }
      if (minLength !== undefined) {
        expr += `.min(${minLength})`;
      }
      if (maxLength !== undefined) {
        expr += `.max(${maxLength})`;
      }
      if (pattern !== undefined) {
        expr += `.regex(new RegExp(${lit(pattern)}))`;
      }
      if (
        isRequired(field.type) &&
        !isListType(field.type) &&
        widget !== "email" &&
        minLength === undefined
      ) {
        expr += ".min(1)";
      }
      return expr;
    }
    if (inputs.has(typeName)) {
      if (inProgress.has(typeName)) {
        diagnostics.push({
          severity: "warning",
          where,
          message: `Input schema reference cycle at ${typeName} — emitted as z.unknown().`,
        });
        return "z.unknown()";
      }
      emitInput(typeName);
      return `${lcFirst(typeName)}Schema`;
    }
    // JSON and other custom scalars.
    return "z.unknown()";
  };

  const emitInput = (inputName: string): void => {
    if (emitted.has(inputName)) {
      return;
    }
    const node = inputs.get(inputName);
    if (!node) {
      return;
    }
    inProgress.add(inputName);
    const lines = (node.fields ?? []).map((field) => {
      const where = `${inputName}.${field.name.value}`;
      let expr = zodForType(field.type, field, where);
      if (!isRequired(field.type)) {
        expr += ".optional()";
      }
      return `  ${field.name.value}: ${expr},`;
    });
    inProgress.delete(inputName);
    emitted.add(inputName);
    inputBlocks.push(
      `export const ${lcFirst(inputName)}Schema = z.object({\n${lines.join("\n")}\n});`,
    );
  };

  for (const e of entities) {
    if (e.createInput) {
      emitInput(e.createInput.graphqlInputName);
    }
    if (e.updateInput) {
      emitInput(e.updateInput.graphqlInputName);
    }
  }
  for (const a of model.actionForms) {
    if (a.supported && a.fields.length) {
      emitInput(a.graphqlInputName);
    }
  }

  blocks.push(...inputBlocks);
  if (!blocks.length) {
    return emptyFile();
  }
  return banner() + `import { z } from "zod";\n\n` + blocks.join("\n\n") + "\n";
}

// ── Operations ───────────────────────────────────────────────────────────────

export type OperationSource = { name: string; body: string };

/**
 * Typed GraphQL documents — the read/write path's single source. Each is a
 * `TypedDocumentNode<Result, Vars>` whose Result is written in terms of the
 * generated base types, so `client.request(doc, vars)` infers its result with
 * no cast, and the selection set (derived from the same SDL model, nested
 * objects included) can't silently drift when a field is added.
 */
export function emitOperations(model: SdlModel): { code: string; sources: OperationSource[] } {
  const { entities, customOperations, options, diagnostics } = model;
  const typeImports = new Set<string>();
  const blocks: string[] = [];
  const sources: OperationSource[] = [];
  const usedNames = new Set<string>();

  const argSig = (field: RootFieldModel): string =>
    field.args.length ? `(${field.args.map((a) => `$${a.name}: ${a.gqlType}`).join(", ")})` : "";
  const argCall = (field: RootFieldModel): string =>
    field.args.length ? `(${field.args.map((a) => `${a.name}: $${a.name}`).join(", ")})` : "";
  // Nullable args are optional on the wire — mirror that in the vars type so
  // callers with no required variables can omit the object entirely.
  const varsType = (field: RootFieldModel): string =>
    field.args.length
      ? `{ ${field.args
          .map((a) => (a.required ? `${a.name}: ${a.tsType}` : `${a.name}?: ${a.tsType} | null`))
          .join("; ")} }`
      : "Record<string, never>";
  const importArgs = (field: RootFieldModel): void => {
    for (const a of field.args) {
      if (a.importType) {
        typeImports.add(a.importType);
      }
    }
  };

  const push = (
    keyword: "query" | "mutation",
    field: RootFieldModel,
    resultType: string,
    selectionLines: string[],
  ): void => {
    const opName = ucFirst(field.name);
    if (usedNames.has(opName)) {
      diagnostics.push({
        severity: "error",
        where: `${ucFirst(keyword)}.${field.name}`,
        message: `Document name ${opName}Document is already taken by another root field — rename one of them.`,
      });
      return;
    }
    usedNames.add(opName);
    importArgs(field);
    const bodyLines = selectionLines.length
      ? [
          `  ${keyword} ${opName}${argSig(field)} {`,
          `    ${field.name}${argCall(field)} {`,
          selectionLines.map((l) => `      ${l}`).join("\n"),
          `    }`,
          `  }`,
        ]
      : [`  ${keyword} ${opName}${argSig(field)} {`, `    ${field.name}${argCall(field)}`, `  }`];
    const body = bodyLines.join("\n");
    sources.push({ name: `${opName}Document`, body });
    blocks.push(
      `export const ${opName}Document: TypedDocumentNode<{ ${field.name}: ${resultType} }, ${varsType(field)}> = parse(/* GraphQL */ \`\n${body}\n\`);`,
    );
  };

  for (const e of entities) {
    if (!e.selectionLines.length) {
      continue;
    }
    if (e.listField) {
      typeImports.add(e.entity);
      push("query", e.listField, `Types.${e.entity}[]`, e.selectionLines);
    }
    if (e.oneField) {
      typeImports.add(e.entity);
      push("query", e.oneField, `Types.${e.entity} | null`, e.selectionLines);
    }
    if (e.createField) {
      typeImports.add(e.entity);
      push("mutation", e.createField, `Types.${e.entity}`, e.selectionLines);
    }
    if (e.updateField) {
      typeImports.add(e.entity);
      push("mutation", e.updateField, `Types.${e.entity}`, e.selectionLines);
    }
    if (e.deleteField) {
      if (e.deleteField.returnsEntity) {
        typeImports.add(e.entity);
        push("mutation", e.deleteField, `Types.${e.entity}`, e.selectionLines);
      } else {
        push("mutation", e.deleteField, "boolean", []);
      }
    }
  }

  for (const op of customOperations) {
    for (const importName of op.resultImports) {
      typeImports.add(importName);
    }
    push(op.kind, op.field, op.resultTsType, op.selectionLines);
  }

  if (!blocks.length) {
    return { code: emptyFile(), sources };
  }

  const imports = [
    `import { parse } from "graphql";`,
    `import type { TypedDocumentNode } from "@graphql-typed-document-node/core";`,
  ];
  if (typeImports.size) {
    // Namespace import: document consts (`<X>Document`) can never collide with
    // a schema type named like one (e.g. type ProjectDocument vs the document
    // for `query Project`).
    imports.push(`import type * as Types from "${options.typesImportPath}";`);
  }
  return {
    code: banner() + imports.join("\n") + "\n\n" + blocks.join("\n\n") + "\n",
    sources,
  };
}
