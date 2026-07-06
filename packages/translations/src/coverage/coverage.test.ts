import { describe, expect, it } from "vitest";
import type { TypedRegistrationSchema } from "@bota-apps/types";
import { expectedKeysFromSchemas, findMissingKeys, flattenBundleKeys } from "./index";

describe("flattenBundleKeys", () => {
  it("emits namespace:dotted.key for every leaf", () => {
    const keys = flattenBundleKeys({
      projects: { fields: { firstName: "First name", status: "Status" } },
      enums: { projectStatus: { active: "Active" } },
    });

    expect(keys).toEqual(
      new Set([
        "projects:fields.firstName",
        "projects:fields.status",
        "enums:projectStatus.active",
      ]),
    );
  });
});

describe("findMissingKeys", () => {
  it("lists keys present in reference but absent in target, sorted", () => {
    const en = {
      projects: { fields: { firstName: "First name", status: "Status" } },
      enums: { projectStatus: { active: "Active", suspended: "Suspended" } },
    };
    const am = {
      projects: { fields: { firstName: "የመጀመሪያ ስም" } },
      enums: { projectStatus: { active: "ንቁ" } },
    };

    expect(findMissingKeys(en, am)).toEqual([
      "enums:projectStatus.suspended",
      "projects:fields.status",
    ]);
  });

  it("returns [] when the target is a superset", () => {
    const en = { common: { save: "Save" } };
    const am = { common: { save: "አስቀምጥ", cancel: "ሰርዝ" } };
    expect(findMissingKeys(en, am)).toEqual([]);
  });
});

describe("expectedKeysFromSchemas", () => {
  const schema: TypedRegistrationSchema<{ status: string }> = {
    id: "project.create",
    key: "project",
    name: "Create project",
    fields: [
      {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "Pick one",
        optionsKey: "projectStatusOptions",
        options: [
          { label: "Active", value: "active" },
          { label: "Suspended", value: "suspended" },
        ],
      },
    ],
  };

  it("combines namespaced field keys with shared enum keys", () => {
    const expected = expectedKeysFromSchemas([{ schema, ns: "projects" }]);

    expect(expected).toEqual(
      new Set([
        "projects:fields.status",
        "projects:placeholders.status",
        "enums:projectStatus.active",
        "enums:projectStatus.suspended",
      ]),
    );
  });

  it("honors a custom enum namespace", () => {
    const expected = expectedKeysFromSchemas([{ schema, ns: "projects" }], "lookups");
    expect(expected.has("lookups:projectStatus.active")).toBe(true);
    expect(expected.has("enums:projectStatus.active")).toBe(false);
  });
});
