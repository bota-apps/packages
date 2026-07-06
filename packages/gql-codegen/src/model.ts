// SDL → domain model. Reads an annotated GraphQL SDL (the API-side single
// source of truth) and extracts a rich per-entity model that the emitters turn
// into domain definitions, form/detail schemas, enum metadata, Zod validators,
// and typed GraphQL documents.
//
// Unsupported SDL never aborts a run wholesale: what can't become good UI is
// skipped with a diagnostic (a required unsupported input field skips that one
// form; everything else still generates). Only contradictions the SDL author
// must fix — e.g. an @widget that doesn't fit the field's type — are errors.
import { Kind, parse } from "graphql";
import type {
  ConstDirectiveNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  FieldDefinitionNode,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  ScalarTypeDefinitionNode,
  TypeNode,
} from "graphql";
import type { DomainFieldConstraint, DomainFieldDefinition, DomainScalar } from "@bota-apps/types";
import { humanize } from "./humanize";
import { isDomainWidget, widgetAllowed, widgetForField } from "./widgetPolicy";

export type Diagnostic = {
  severity: "info" | "warning" | "error";
  /** Where in the SDL, e.g. "Project.budget" or "CreateProjectInput.tags". */
  where: string;
  message: string;
};

export type GenerateOptions = {
  /** The object type treated as the platform money value (default "Money"). */
  moneyTypeName?: string;
  /** Max nesting depth for generated selection sets (default 4). */
  maxSelectionDepth?: number;
  /** Import specifier for the base types file emitted by @graphql-codegen/typescript (default "./types"). */
  typesImportPath?: string;
};

export type ResolvedOptions = Required<GenerateOptions>;

export const defaultOptions: ResolvedOptions = {
  moneyTypeName: "Money",
  maxSelectionDepth: 4,
  typesImportPath: "./types",
};

export type FieldModel = DomainFieldDefinition;

export type InputFormModel = {
  graphqlInputName: string;
  /** The renderable form fields (unsupported optional fields already omitted). */
  fields: FieldModel[];
  /** False when a required field can't be rendered — no form is emitted. */
  supported: boolean;
};

export type RootArgModel = {
  name: string;
  gqlType: string;
  tsType: string;
  /** False for nullable args — emitted as optional (`name?: T | null`). */
  required: boolean;
  /** Named arg types that must be imported from the base types file. */
  importType?: string;
};

export type RootFieldModel = {
  name: string;
  args: RootArgModel[];
  /** True when the field returns the entity (list or single); false for Boolean results. */
  returnsEntity: boolean;
};

/**
 * A Query/Mutation root field not claimed by an entity's CRUD conventions —
 * singleton/aggregate queries (`dashboardOverview`, `organizationProfile`) and
 * custom mutations (`setActiveSprint`, `lockTask`). Every root field
 * gets a document so apps never hand-write operations.
 */
export type CustomOperationModel = {
  kind: "query" | "mutation";
  field: RootFieldModel;
  /** TS type of the root field's result, nullability included (e.g. "Task[]", "Project | null", "unknown"). */
  resultTsType: string;
  /** Named types the result type must import from the base types file. */
  resultImports: string[];
  /** Selection lines for object results; empty for leaf results (scalars, enums, JSON). */
  selectionLines: string[];
};

/**
 * A form projected from a custom mutation's input-object argument. The mutation
 * exists in the SDL (e.g. `promoteProject(input: PromoteProjectInput!)`) but
 * isn't entity CRUD, so the entity conventions never emit a form for it — yet
 * the input is still a real API contract that deserves a generated DynamicForm.
 * Apps stop hand-authoring these forms.
 */
export type ActionFormModel = {
  /** The mutation field name — the form's identity, e.g. "promoteProject". */
  mutationName: string;
  /** The input object type name, e.g. "PromoteProjectInput". */
  graphqlInputName: string;
  /** The renderable form fields (unsupported optional fields already omitted). */
  fields: FieldModel[];
  /** False when a required field can't be rendered — no form is emitted. */
  supported: boolean;
  /** Sorted, deduped `<enum>Options` export names referenced by this form's fields. */
  optionKeys: string[];
};

/**
 * An object type marked `@detailView` that isn't an entity (no Create/Update
 * input) — a read-only projection such as `OrganizationProfile`. It gets a
 * generated detail schema, but claims no root fields and alters no operations.
 */
export type DetailViewModel = {
  typeName: string;
  base: string;
  /** Detail-visible fields (no `id`, no @detail(hidden), renderable kinds only). */
  fields: FieldModel[];
  /** Sorted, deduped `<enum>Options` export names referenced by these fields. */
  optionKeys: string[];
};

export type EntityModel = {
  entity: string;
  base: string;
  /** Detail-visible fields (no `id`, no @detail(hidden), renderable kinds only). */
  entityFields: FieldModel[];
  createInput?: InputFormModel;
  updateInput?: InputFormModel;
  /** Selection-set lines (relative indent) covering every fetchable field, nested. */
  selectionLines: string[];
  listField?: RootFieldModel;
  oneField?: RootFieldModel;
  createField?: RootFieldModel;
  updateField?: RootFieldModel;
  deleteField?: RootFieldModel;
  /** Sorted, deduped `<enum>Options` export names referenced by this entity's fields. */
  optionKeys: string[];
};

export type SdlModel = {
  doc: DocumentNode;
  enums: EnumTypeDefinitionNode[];
  enumNames: Set<string>;
  objects: Map<string, ObjectTypeDefinitionNode>;
  inputs: Map<string, InputObjectTypeDefinitionNode>;
  entities: EntityModel[];
  customOperations: CustomOperationModel[];
  actionForms: ActionFormModel[];
  detailViews: DetailViewModel[];
  options: ResolvedOptions;
  diagnostics: Diagnostic[];
};

// Enum defined alongside the @widget directive to type its argument — not a domain enum.
const widgetEnumName = "FormWidget";
const builtinScalars = new Set(["ID", "String", "Int", "Float", "Boolean"]);
const rootTypeNames = new Set(["Query", "Mutation", "Subscription"]);

// ── SDL AST helpers ──────────────────────────────────────────────────────────

export function namedType(typeNode: TypeNode): string {
  let node = typeNode;
  while (node.kind === Kind.NON_NULL_TYPE || node.kind === Kind.LIST_TYPE) {
    node = node.type;
  }
  return node.name.value;
}

export function printGqlType(typeNode: TypeNode): string {
  if (typeNode.kind === Kind.NON_NULL_TYPE) {
    return `${printGqlType(typeNode.type)}!`;
  }
  if (typeNode.kind === Kind.LIST_TYPE) {
    return `[${printGqlType(typeNode.type)}]`;
  }
  return typeNode.name.value;
}

export function isRequired(typeNode: TypeNode): boolean {
  return typeNode.kind === Kind.NON_NULL_TYPE;
}

export function isListType(typeNode: TypeNode): boolean {
  let node = typeNode;
  while (node.kind === Kind.NON_NULL_TYPE) {
    node = node.type;
  }
  return node.kind === Kind.LIST_TYPE;
}

export type DirectiveHost = FieldDefinitionNode | InputValueDefinitionNode;

export function directive(node: DirectiveHost, name: string): ConstDirectiveNode | undefined {
  return (node.directives ?? []).find((d) => d.name.value === name);
}

export function argValue(dir: ConstDirectiveNode | undefined, argName: string): unknown {
  const arg = (dir?.arguments ?? []).find((a) => a.name.value === argName);
  if (!arg) {
    return undefined;
  }
  const v = arg.value;
  if (v.kind === Kind.INT || v.kind === Kind.FLOAT) {
    return Number(v.value);
  }
  if (v.kind === Kind.BOOLEAN) {
    return v.value;
  }
  if (v.kind === Kind.STRING || v.kind === Kind.ENUM) {
    return v.value;
  }
  return undefined;
}

export function stringArg(
  dir: ConstDirectiveNode | undefined,
  argName: string,
): string | undefined {
  const value = argValue(dir, argName);
  return typeof value === "string" ? value : undefined;
}

export function numberArg(
  dir: ConstDirectiveNode | undefined,
  argName: string,
): number | undefined {
  const value = argValue(dir, argName);
  return typeof value === "number" ? value : undefined;
}

function constraintsFor(fieldNode: DirectiveHost): DomainFieldConstraint | undefined {
  const out: DomainFieldConstraint = {};
  const min = numberArg(directive(fieldNode, "min"), "value");
  const max = numberArg(directive(fieldNode, "max"), "value");
  const minLength = numberArg(directive(fieldNode, "minLength"), "value");
  const maxLength = numberArg(directive(fieldNode, "maxLength"), "value");
  const pattern = stringArg(directive(fieldNode, "pattern"), "value");
  if (min !== undefined) {
    out.min = min;
  }
  if (max !== undefined) {
    out.max = max;
  }
  if (minLength !== undefined) {
    out.minLength = minLength;
  }
  if (maxLength !== undefined) {
    out.maxLength = maxLength;
  }
  if (pattern !== undefined) {
    out.pattern = pattern;
  }
  return Object.keys(out).length ? out : undefined;
}

export const lcFirst = (s: string): string => s.charAt(0).toLowerCase() + s.slice(1);
export const ucFirst = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

// ── Field classification ─────────────────────────────────────────────────────

type FieldKind =
  | { kind: "scalar"; scalar: DomainScalar }
  | { kind: "enum"; enumName: string }
  | { kind: "money" }
  | { kind: "object"; typeName: string }
  | { kind: "inputObject"; typeName: string }
  | { kind: "customScalar"; typeName: string }
  | { kind: "unknown"; typeName: string };

function classify(typeName: string, model: ClassifyContext): FieldKind {
  if (typeName === model.moneyTypeName) {
    return { kind: "money" };
  }
  if (builtinScalars.has(typeName)) {
    // The five built-ins are DomainScalar members by construction.
    return { kind: "scalar", scalar: typeName as DomainScalar };
  }
  if (model.enumNames.has(typeName)) {
    return { kind: "enum", enumName: typeName };
  }
  if (model.objects.has(typeName)) {
    return { kind: "object", typeName };
  }
  if (model.inputs.has(typeName)) {
    return { kind: "inputObject", typeName };
  }
  if (model.customScalarNames.has(typeName)) {
    return { kind: "customScalar", typeName };
  }
  return { kind: "unknown", typeName };
}

type ClassifyContext = {
  moneyTypeName: string;
  enumNames: Set<string>;
  objects: Map<string, ObjectTypeDefinitionNode>;
  inputs: Map<string, InputObjectTypeDefinitionNode>;
  customScalarNames: Set<string>;
};

// ── Field definitions (forms + detail) ───────────────────────────────────────

type BuiltField = { def: FieldModel; hidden: boolean };

function fieldDefinition(
  fieldNode: DirectiveHost,
  index: number,
  scalar: DomainScalar,
  enumName: string | undefined,
  parentName: string,
  diagnostics: Diagnostic[],
): BuiltField {
  const name = fieldNode.name.value;
  const where = `${parentName}.${name}`;

  const widgetDir = directive(fieldNode, "widget");
  const requestedWidget = stringArg(widgetDir, "type");
  if (requestedWidget !== undefined) {
    if (!isDomainWidget(requestedWidget)) {
      diagnostics.push({
        severity: "error",
        where,
        message: `@widget(type: ${requestedWidget}) is not a known widget.`,
      });
    } else if (!widgetAllowed(requestedWidget, scalar)) {
      diagnostics.push({
        severity: "error",
        where,
        message: `@widget(type: ${requestedWidget}) is not valid for a ${enumName ?? scalar} field.`,
      });
    }
  }

  const def: FieldModel = {
    name,
    label: stringArg(directive(fieldNode, "label"), "value") ?? humanize(name),
    scalar,
    graphqlType: printGqlType(fieldNode.type),
    required: isRequired(fieldNode.type),
    widget: widgetForField({
      scalar,
      widget: requestedWidget && isDomainWidget(requestedWidget) ? requestedWidget : undefined,
    }),
    order: numberArg(directive(fieldNode, "order"), "value") ?? index,
  };
  const constraints = constraintsFor(fieldNode);
  if (constraints) {
    def.constraints = constraints;
  }
  const placeholder = stringArg(directive(fieldNode, "placeholder"), "value");
  if (placeholder !== undefined) {
    def.placeholder = placeholder;
  }
  const description = stringArg(directive(fieldNode, "description"), "value");
  if (description !== undefined) {
    def.description = description;
  }
  const section = stringArg(directive(fieldNode, "section"), "value");
  if (section !== undefined) {
    def.section = section;
  }
  if (enumName !== undefined) {
    def.enumName = enumName;
    def.optionsKey = `${lcFirst(enumName)}Options`;
  }

  const hidden = argValue(directive(fieldNode, "detail"), "hidden") === true;
  return { def, hidden };
}

const byOrder = (a: FieldModel, b: FieldModel): number => a.order - b.order;

// ── Selection sets ────────────────────────────────────────────────────────────

/**
 * Selection-set lines for an object type: every leaf field (built-in scalars,
 * enums, custom scalars) plus nested sub-selections for object fields — Money
 * included. Recursion is cycle-guarded (a field whose type is already on the
 * ancestor path is skipped) and depth-capped.
 */
function selectionLinesFor(
  typeName: string,
  ctx: ClassifyContext,
  options: ResolvedOptions,
  diagnostics: Diagnostic[],
  path: string[],
): string[] {
  const node = ctx.objects.get(typeName);
  if (!node) {
    return [];
  }
  const lines: string[] = [];
  for (const field of node.fields ?? []) {
    const fieldType = namedType(field.type);
    const kind = classify(fieldType, ctx);
    const where = `${typeName}.${field.name.value}`;
    const requiredArgs = (field.arguments ?? []).filter(
      (a) => a.type.kind === Kind.NON_NULL_TYPE && a.defaultValue === undefined,
    );
    if (requiredArgs.length) {
      diagnostics.push({
        severity: "info",
        where,
        message: `Skipped from generated selections: takes required argument(s) ${requiredArgs.map((a) => a.name.value).join(", ")} — fetch it with a hand-written document.`,
      });
      continue;
    }
    switch (kind.kind) {
      case "scalar":
      case "enum":
      case "customScalar": {
        lines.push(field.name.value);
        break;
      }
      case "money":
      case "object": {
        const nestedType = kind.kind === "money" ? options.moneyTypeName : kind.typeName;
        if (path.includes(nestedType)) {
          diagnostics.push({
            severity: "info",
            where,
            message: `Skipped from generated selections: recursion into ${nestedType} (cycle).`,
          });
          break;
        }
        if (path.length >= options.maxSelectionDepth) {
          diagnostics.push({
            severity: "info",
            where,
            message: `Skipped from generated selections: nesting exceeds maxSelectionDepth (${options.maxSelectionDepth}).`,
          });
          break;
        }
        const inner =
          kind.kind === "money"
            ? moneySelectionLines(ctx, options)
            : selectionLinesFor(nestedType, ctx, options, diagnostics, [...path, typeName]);
        if (inner.length === 0) {
          diagnostics.push({
            severity: "info",
            where,
            message: `Skipped from generated selections: ${nestedType} has no selectable fields at this depth.`,
          });
          break;
        }
        lines.push(`${field.name.value} {`, ...inner.map((l) => `  ${l}`), "}");
        break;
      }
      case "inputObject":
      case "unknown": {
        diagnostics.push({
          severity: "warning",
          where,
          message: `Skipped from generated selections: unsupported field type ${fieldType}.`,
        });
        break;
      }
    }
  }
  return lines;
}

/** Money's own selection: its scalar leaves, from the SDL when present. */
function moneySelectionLines(ctx: ClassifyContext, options: ResolvedOptions): string[] {
  const node = ctx.objects.get(options.moneyTypeName);
  if (node) {
    return (node.fields ?? []).map((f) => f.name.value);
  }
  return ["amount", "currency"];
}

// ── Model construction ────────────────────────────────────────────────────────

/** Field kinds a DynamicForm can render. */
function formFieldFor(
  field: InputValueDefinitionNode,
  index: number,
  inputName: string,
  ctx: ClassifyContext,
  diagnostics: Diagnostic[],
): { def?: FieldModel; unsupportedRequired?: boolean } {
  const where = `${inputName}.${field.name.value}`;
  const typeName = namedType(field.type);
  const kind = classify(typeName, ctx);

  if (
    isListType(field.type) ||
    kind.kind === "inputObject" ||
    kind.kind === "customScalar" ||
    kind.kind === "money" ||
    kind.kind === "object" ||
    kind.kind === "unknown"
  ) {
    const required = isRequired(field.type);
    diagnostics.push({
      severity: required ? "warning" : "info",
      where,
      message: required
        ? `Required field of unsupported form kind (${printGqlType(field.type)}) — no form generated for ${inputName}.`
        : `Optional field of unsupported form kind (${printGqlType(field.type)}) — omitted from the generated form.`,
    });
    return { unsupportedRequired: required };
  }

  const scalar: DomainScalar = kind.kind === "enum" ? "Enum" : kind.scalar;
  const enumName = kind.kind === "enum" ? kind.enumName : undefined;
  return { def: fieldDefinition(field, index, scalar, enumName, inputName, diagnostics).def };
}

function inputFormModel(
  input: InputObjectTypeDefinitionNode,
  ctx: ClassifyContext,
  diagnostics: Diagnostic[],
): InputFormModel {
  const fields: FieldModel[] = [];
  let supported = true;
  (input.fields ?? []).forEach((field, index) => {
    const built = formFieldFor(field, index, input.name.value, ctx, diagnostics);
    if (built.def) {
      fields.push(built.def);
    }
    if (built.unsupportedRequired) {
      supported = false;
    }
  });
  fields.sort(byOrder);
  return { graphqlInputName: input.name.value, fields, supported };
}

/**
 * Detail-visible fields of an object type: drop `id`, `@detail(hidden)`, and
 * kinds a detail view can't render (lists, nested non-Money objects, custom
 * scalars). Shared by entity detail schemas and standalone `@detailView` types.
 */
function detailFieldsFor(
  object: ObjectTypeDefinitionNode,
  ctx: ClassifyContext,
  diagnostics: Diagnostic[],
): FieldModel[] {
  const typeName = object.name.value;
  const fields: FieldModel[] = [];
  (object.fields ?? []).forEach((field, index) => {
    const name = field.name.value;
    if (name === "id") {
      return;
    }
    const where = `${typeName}.${name}`;
    const kind = classify(namedType(field.type), ctx);
    if (
      isListType(field.type) ||
      kind.kind === "object" ||
      kind.kind === "inputObject" ||
      kind.kind === "customScalar" ||
      kind.kind === "unknown"
    ) {
      diagnostics.push({
        severity: "info",
        where,
        message: `Skipped from the generated detail view: unsupported kind (${printGqlType(field.type)}). Still fetched by generated selections.`,
      });
      return;
    }
    const scalar: DomainScalar =
      kind.kind === "money" ? "Money" : kind.kind === "enum" ? "Enum" : kind.scalar;
    const enumName = kind.kind === "enum" ? kind.enumName : undefined;
    const built = fieldDefinition(field, index, scalar, enumName, typeName, diagnostics);
    if (!built.hidden) {
      fields.push(built.def);
    }
  });
  fields.sort(byOrder);
  return fields;
}

/** Sorted, deduped `<enum>Options` export names referenced by a field list. */
function optionKeysFor(fields: readonly FieldModel[]): string[] {
  return [
    ...new Set(fields.map((d) => d.optionsKey).filter((k): k is string => k !== undefined)),
  ].sort();
}

function tsBaseForNamed(named: string): { base: string; importType?: string } {
  if (named === "ID" || named === "String") {
    return { base: "string" };
  }
  if (named === "Int" || named === "Float") {
    return { base: "number" };
  }
  if (named === "Boolean") {
    return { base: "boolean" };
  }
  // Namespace-qualified: operations.ts imports the base types as
  // `import type * as Types` so `<X>Document` consts can never collide with a
  // schema type that happens to be named like one (e.g. type ProjectDocument).
  return { base: `Types.${named}`, importType: named };
}

function tsTypeForArg(typeNode: TypeNode): { tsType: string; importType?: string } {
  const { base, importType } = tsBaseForNamed(namedType(typeNode));
  // Top-level nullability is the emitter's concern (`name?: T | null` from
  // `required`), so render without it; inner list-element nullability stays.
  const out: { tsType: string; importType?: string } = {
    tsType: tsTypeSansTopNull(typeNode, base),
  };
  if (importType !== undefined) {
    out.importType = importType;
  }
  return out;
}

function rootFieldModel(field: FieldDefinitionNode, entityName: string): RootFieldModel {
  return {
    name: field.name.value,
    args: (field.arguments ?? []).map((a) => ({
      name: a.name.value,
      gqlType: printGqlType(a.type),
      required: isRequired(a.type),
      ...tsTypeForArg(a.type),
    })),
    returnsEntity: namedType(field.type) === entityName,
  };
}

/** The TS type minus its top-level nullability; list-element nullability stays. */
function tsTypeSansTopNull(typeNode: TypeNode, base: string): string {
  const node = typeNode.kind === Kind.NON_NULL_TYPE ? typeNode.type : typeNode;
  if (node.kind === Kind.LIST_TYPE) {
    const element = tsTypeForReturn(node.type, base);
    return element.includes(" ") ? `(${element})[]` : `${element}[]`;
  }
  return base;
}

/**
 * TS rendering of a GraphQL type with nullability mapped faithfully:
 * `X` → `X | null`, `[X!]!` → `X[]`, `[X]!` → `(X | null)[]`.
 */
function tsTypeForReturn(typeNode: TypeNode, base: string): string {
  const sansNull = tsTypeSansTopNull(typeNode, base);
  return typeNode.kind === Kind.NON_NULL_TYPE ? sansNull : `${sansNull} | null`;
}

export function buildModel(sdl: string, rawOptions: GenerateOptions = {}): SdlModel {
  const options: ResolvedOptions = { ...defaultOptions, ...rawOptions };
  const doc = parse(sdl);
  const diagnostics: Diagnostic[] = [];

  const enums = doc.definitions.filter(
    (d): d is EnumTypeDefinitionNode =>
      d.kind === Kind.ENUM_TYPE_DEFINITION && d.name.value !== widgetEnumName,
  );
  const enumNames = new Set(enums.map((e) => e.name.value));
  const objects = new Map(
    doc.definitions
      .filter((d): d is ObjectTypeDefinitionNode => d.kind === Kind.OBJECT_TYPE_DEFINITION)
      .filter((d) => !rootTypeNames.has(d.name.value))
      .map((d) => [d.name.value, d]),
  );
  const inputs = new Map(
    doc.definitions
      .filter(
        (d): d is InputObjectTypeDefinitionNode => d.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION,
      )
      .map((d) => [d.name.value, d]),
  );
  const customScalarNames = new Set(
    doc.definitions
      .filter((d): d is ScalarTypeDefinitionNode => d.kind === Kind.SCALAR_TYPE_DEFINITION)
      .map((d) => d.name.value),
  );

  const ctx: ClassifyContext = {
    moneyTypeName: options.moneyTypeName,
    enumNames,
    objects,
    inputs,
    customScalarNames,
  };

  const rootFields = (rootName: string): FieldDefinitionNode[] =>
    doc.definitions
      .filter(
        (d): d is ObjectTypeDefinitionNode | ObjectTypeExtensionNode =>
          (d.kind === Kind.OBJECT_TYPE_DEFINITION || d.kind === Kind.OBJECT_TYPE_EXTENSION) &&
          d.name.value === rootName,
      )
      .flatMap((d) => [...(d.fields ?? [])]);
  const queryFields = rootFields("Query");
  const mutationFields = rootFields("Mutation");

  // Root fields claimed by an entity's CRUD conventions ("query:departments",
  // "mutation:createDepartment") — everything unclaimed becomes a custom operation.
  const claimedRootFields = new Set<string>();

  // A domain entity is any object type with a matching Create<X>Input or
  // Update<X>Input (update-only entities exist: services without create/delete).
  const entities: EntityModel[] = [];
  for (const [entityName, object] of objects) {
    if (entityName === options.moneyTypeName) {
      continue;
    }
    const createInputNode = inputs.get(`Create${entityName}Input`);
    const updateInputNode = inputs.get(`Update${entityName}Input`);
    if (!createInputNode && !updateInputNode) {
      continue;
    }

    // Detail-visible entity fields: drop id, @detail(hidden), and kinds a
    // detail view can't render (lists, nested non-Money objects, JSON).
    const entityFields = detailFieldsFor(object, ctx, diagnostics);

    const createInput = createInputNode
      ? inputFormModel(createInputNode, ctx, diagnostics)
      : undefined;
    const updateInput = updateInputNode
      ? inputFormModel(updateInputNode, ctx, diagnostics)
      : undefined;

    const selectionLines = selectionLinesFor(entityName, ctx, options, diagnostics, []);

    const listNode = queryFields.find(
      (f) => namedType(f.type) === entityName && isListType(f.type),
    );
    const oneNode = queryFields.find(
      (f) => namedType(f.type) === entityName && !isListType(f.type),
    );
    const createNode = createInput?.graphqlInputName
      ? mutationFields.find((f) => f.name.value === `create${entityName}`)
      : undefined;
    const updateNode = updateInput?.graphqlInputName
      ? mutationFields.find((f) => f.name.value === `update${entityName}`)
      : undefined;
    const deleteNode = mutationFields.find((f) => f.name.value === `delete${entityName}`);

    const optionKeys = optionKeysFor([
      ...entityFields,
      ...(createInput?.fields ?? []),
      ...(updateInput?.fields ?? []),
    ]);

    for (const [root, node] of [
      ["query", listNode],
      ["query", oneNode],
      ["mutation", createNode],
      ["mutation", updateNode],
      ["mutation", deleteNode],
    ] as const) {
      if (node) {
        claimedRootFields.add(`${root}:${node.name.value}`);
      }
    }

    entities.push({
      entity: entityName,
      base: lcFirst(entityName),
      entityFields,
      createInput,
      updateInput,
      selectionLines,
      listField: listNode ? rootFieldModel(listNode, entityName) : undefined,
      oneField: oneNode ? rootFieldModel(oneNode, entityName) : undefined,
      createField: createNode ? rootFieldModel(createNode, entityName) : undefined,
      updateField: updateNode ? rootFieldModel(updateNode, entityName) : undefined,
      deleteField: deleteNode ? rootFieldModel(deleteNode, entityName) : undefined,
      optionKeys,
    });
  }

  // Every unclaimed mutation whose input is an input object gets a form too —
  // the mutation is a real API action (promote, suspend, bulk-adjust…) whose
  // input deserves a DynamicForm even though it isn't entity CRUD. The
  // form-bearing argument is the input-object arg (preferring one named
  // "input"); scalar-only actions (`lockTask(id: ID!)`) yield no form.
  const actionForms: ActionFormModel[] = [];
  for (const field of mutationFields) {
    const name = field.name.value;
    if (claimedRootFields.has(`mutation:${name}`) || name.startsWith("_")) {
      continue;
    }
    const inputArgs = (field.arguments ?? []).filter((a) => inputs.has(namedType(a.type)));
    if (inputArgs.length === 0) {
      continue;
    }
    const inputArg =
      inputArgs.find((a) => a.name.value === "input") ??
      (inputArgs.length === 1 ? inputArgs[0] : undefined);
    if (!inputArg) {
      diagnostics.push({
        severity: "info",
        where: `Mutation.${name}`,
        message: `No form generated: several input-object arguments and none named "input".`,
      });
      continue;
    }
    const inputNode = inputs.get(namedType(inputArg.type));
    if (!inputNode) {
      continue;
    }
    const form = inputFormModel(inputNode, ctx, diagnostics);
    actionForms.push({
      mutationName: name,
      graphqlInputName: form.graphqlInputName,
      fields: form.fields,
      supported: form.supported,
      optionKeys: optionKeysFor(form.fields),
    });
  }

  // Object types marked `@detailView` that aren't entities (no Create/Update
  // input) — read-only projections like OrganizationProfile. They get a detail
  // schema so apps stop hand-authoring DynamicDetail schemas, but claim no root
  // fields and change no operations: their query stays a custom operation (its
  // nullability intact), unlike an entity's oneField which is forced nullable.
  const entityNames = new Set(entities.map((e) => e.entity));
  const detailViews: DetailViewModel[] = [];
  for (const [typeName, object] of objects) {
    if (typeName === options.moneyTypeName || entityNames.has(typeName)) {
      continue;
    }
    if (!(object.directives ?? []).some((d) => d.name.value === "detailView")) {
      continue;
    }
    const fields = detailFieldsFor(object, ctx, diagnostics);
    if (!fields.length) {
      diagnostics.push({
        severity: "warning",
        where: typeName,
        message: "@detailView type has no renderable fields — no detail schema generated.",
      });
      continue;
    }
    detailViews.push({
      typeName,
      base: lcFirst(typeName),
      fields,
      optionKeys: optionKeysFor(fields),
    });
  }

  // Every unclaimed root field becomes a custom operation — its document is
  // generated too, so apps never hand-write operations for aggregates or
  // domain-specific mutations. Selections are memoized per return type to
  // avoid duplicating the skip diagnostics selectionLinesFor emits.
  const selectionCache = new Map<string, string[]>(
    entities.map((e) => [e.entity, e.selectionLines]),
  );
  const selectionFor = (typeName: string): string[] => {
    let lines = selectionCache.get(typeName);
    if (lines === undefined) {
      lines =
        typeName === options.moneyTypeName
          ? moneySelectionLines(ctx, options)
          : selectionLinesFor(typeName, ctx, options, diagnostics, []);
      selectionCache.set(typeName, lines);
    }
    return lines;
  };

  const customOperations: CustomOperationModel[] = [];
  const roots: readonly ["query" | "mutation", FieldDefinitionNode[]][] = [
    ["query", queryFields],
    ["mutation", mutationFields],
  ];
  for (const [kind, fields] of roots) {
    for (const field of fields) {
      const name = field.name.value;
      const where = `${ucFirst(kind)}.${name}`;
      if (claimedRootFields.has(`${kind}:${name}`)) {
        continue;
      }
      if (name.startsWith("_")) {
        diagnostics.push({
          severity: "info",
          where,
          message: "Skipped: underscore-prefixed root fields are treated as internal.",
        });
        continue;
      }

      const returnTypeName = namedType(field.type);
      const returnKind = classify(returnTypeName, ctx);
      let base: string;
      let resultImports: string[] = [];
      let selectionLines: string[] = [];
      switch (returnKind.kind) {
        case "scalar": {
          base =
            returnKind.scalar === "ID" || returnKind.scalar === "String"
              ? "string"
              : returnKind.scalar === "Boolean"
                ? "boolean"
                : "number";
          break;
        }
        case "enum": {
          base = `Types.${returnKind.enumName}`;
          resultImports = [returnKind.enumName];
          break;
        }
        case "customScalar": {
          // Matches the app codegen's custom-scalar mapping default (JSON → unknown).
          base = "unknown";
          break;
        }
        case "money":
        case "object": {
          const typeName =
            returnKind.kind === "money" ? options.moneyTypeName : returnKind.typeName;
          selectionLines = selectionFor(typeName);
          if (!selectionLines.length) {
            diagnostics.push({
              severity: "warning",
              where,
              message: `Skipped: ${typeName} has no selectable fields, so no valid document can be generated.`,
            });
            continue;
          }
          base = `Types.${typeName}`;
          resultImports = [typeName];
          break;
        }
        case "inputObject":
        case "unknown": {
          diagnostics.push({
            severity: "warning",
            where,
            message: `Skipped: unsupported root field return type ${returnTypeName}.`,
          });
          continue;
        }
      }

      customOperations.push({
        kind,
        field: rootFieldModel(field, returnTypeName),
        resultTsType: tsTypeForReturn(field.type, base),
        resultImports,
        selectionLines,
      });
    }
  }

  return {
    doc,
    enums,
    enumNames,
    objects,
    inputs,
    entities,
    customOperations,
    actionForms,
    detailViews,
    options,
    diagnostics,
  };
}
