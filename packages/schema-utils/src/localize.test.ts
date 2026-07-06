import { describe, expect, it } from "vitest";
import type { CreateInputDefinition, DomainOptionsMap, EntityDefinition } from "@bota-apps/types";
import { buildCreateFormSchema } from "./domainDefinition/buildCreateFormSchema";
import { buildDetailSchema } from "./domainDefinition/buildDetailSchema";
import {
  collectSchemaKeys,
  localizeDetailSchema,
  localizeFormSchema,
  translatedOptions,
  type LocalizeContext,
} from "./localize";

describe("translatedOptions", () => {
  it("translates each generated option's label via `${prefix}.${value}`", () => {
    const generated = [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ];
    const t = (key: string) => `t:${key}`;
    expect(translatedOptions(generated, t, "project.status")).toEqual([
      { value: "active", label: "t:project.status.active" },
      { value: "inactive", label: "t:project.status.inactive" },
    ]);
  });
});

type Project = { name: string; status: string };

const options: DomainOptionsMap = {
  projectStatusOptions: [
    { label: "Active", value: "active" },
    { label: "Suspended", value: "suspended" },
  ],
};

const createDefinition: CreateInputDefinition<Project> = {
  name: "CreateProjectInput",
  graphqlInputName: "CreateProjectInput",
  formId: "project.create",
  formKey: "project",
  title: "Create project",
  fields: [
    {
      name: "name",
      label: "Name",
      scalar: "String",
      graphqlType: "String!",
      required: true,
      widget: "text",
      placeholder: "Enter name",
      description: "The legal name",
      order: 0,
    },
    {
      name: "status",
      label: "Status",
      scalar: "Enum",
      graphqlType: "ProjectStatus!",
      required: true,
      widget: "select",
      order: 1,
      enumName: "ProjectStatus",
      optionsKey: "projectStatusOptions",
    },
  ],
};

const entityDefinition: EntityDefinition<Project> = {
  name: "Project",
  graphqlTypeName: "Project",
  detailId: "project.detail",
  title: "Project",
  fields: createDefinition.fields,
};

// A translator/exists pair backed by a flat dictionary keyed "<ns>:<key>".
function makeCtx(dict: Record<string, string>): LocalizeContext {
  const fieldNs = "projects";
  const enumNs = "enums";
  return {
    t: (key) => dict[`${fieldNs}:${key}`] ?? key,
    enumT: (key) => dict[`${enumNs}:${key}`] ?? key,
    exists: (key) => `${fieldNs}:${key}` in dict,
    enumExists: (key) => `${enumNs}:${key}` in dict,
  };
}

describe("localizeFormSchema", () => {
  it("swaps label, placeholder, and description when the key exists", () => {
    const schema = buildCreateFormSchema(createDefinition, { options });
    const ctx = makeCtx({
      "projects:fields.name": "ስም",
      "projects:placeholders.name": "ስም ያስገቡ",
      "projects:descriptions.name": "ሕጋዊ ስም",
    });

    const localized = localizeFormSchema(schema, ctx);
    const nameField = localized.fields[0];

    expect(nameField.label).toBe("ስም");
    expect(nameField.placeholder).toBe("ስም ያስገቡ");
    expect(nameField.description).toBe("ሕጋዊ ስም");
  });

  it("falls back to the generated string when the key is missing", () => {
    const schema = buildCreateFormSchema(createDefinition, { options });
    const localized = localizeFormSchema(schema, makeCtx({}));
    const nameField = localized.fields[0];

    expect(nameField.label).toBe("Name");
    expect(nameField.placeholder).toBe("Enter name");
    expect(nameField.description).toBe("The legal name");
  });

  it("swaps enum option labels via the shared enum namespace", () => {
    const schema = buildCreateFormSchema(createDefinition, { options });
    const ctx = makeCtx({
      "enums:projectStatus.active": "ንቁ",
      "enums:projectStatus.suspended": "የታገደ",
    });

    const localized = localizeFormSchema(schema, ctx);
    const statusField = localized.fields[1];

    expect(statusField.options).toEqual([
      { label: "ንቁ", value: "active" },
      { label: "የታገደ", value: "suspended" },
    ]);
  });

  it("keeps the generated option label when the enum key is missing", () => {
    const schema = buildCreateFormSchema(createDefinition, { options });
    const localized = localizeFormSchema(schema, makeCtx({}));
    const statusField = localized.fields[1];

    expect(statusField.options).toEqual([
      { label: "Active", value: "active" },
      { label: "Suspended", value: "suspended" },
    ]);
  });

  it("is immutable — never mutates the builder output", () => {
    const schema = buildCreateFormSchema(createDefinition, { options });
    const before = structuredClone(schema);
    localizeFormSchema(schema, makeCtx({ "projects:fields.name": "ስም" }));
    expect(schema).toEqual(before);
  });
});

describe("localizeDetailSchema", () => {
  it("localizes labels and enum options", () => {
    const schema = buildDetailSchema(entityDefinition, { options });
    const ctx = makeCtx({
      "projects:fields.status": "ሁኔታ",
      "enums:projectStatus.active": "ንቁ",
    });

    const localized = localizeDetailSchema(schema, ctx);
    const statusField = localized.fields[1];

    expect(statusField.label).toBe("ሁኔታ");
    expect(statusField.options?.[0]).toEqual({ label: "ንቁ", value: "active" });
  });
});

describe("collectSchemaKeys", () => {
  it("derives field, placeholder, description, and enum keys", () => {
    const schema = buildCreateFormSchema(createDefinition, { options });
    const keys = collectSchemaKeys(schema);

    expect(keys.fieldKeys).toEqual(["fields.name", "fields.status"]);
    expect(keys.placeholderKeys).toEqual(["placeholders.name"]);
    expect(keys.descriptionKeys).toEqual(["descriptions.name"]);
    expect(keys.enumKeys).toEqual(["projectStatus.active", "projectStatus.suspended"]);
  });

  it("omits placeholder/description keys for detail schemas", () => {
    const schema = buildDetailSchema(entityDefinition, { options });
    const keys = collectSchemaKeys(schema);

    expect(keys.fieldKeys).toEqual(["fields.name", "fields.status"]);
    expect(keys.placeholderKeys).toEqual([]);
    expect(keys.descriptionKeys).toEqual([]);
    expect(keys.enumKeys).toEqual(["projectStatus.active", "projectStatus.suspended"]);
  });
});
