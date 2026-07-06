import { describe, expect, it } from "vitest";
import { localizeFormSchema } from "@bota-apps/schema-utils/localize";
import type { TypedRegistrationSchema } from "@bota-apps/types";
import { bundleLocalizeContext, resolveBundleKey } from "./index";

const bundle = {
  projects: {
    fields: { status: "ሁኔታ" },
    placeholders: { status: "ሁኔታ ይምረጡ" },
  },
  enums: {
    projectStatus: { active: "ንቁ" },
  },
};

const factory = (): TypedRegistrationSchema<{ status: string }> => ({
  id: "project.create",
  key: "project",
  name: "Create project",
  fields: [
    {
      name: "status",
      label: "Status (generated)",
      type: "select",
      placeholder: "Placeholder (generated)",
      optionsKey: "projectStatusOptions",
      options: [{ label: "Active (generated)", value: "active" }],
    },
  ],
});

describe("resolveBundleKey", () => {
  it("walks a nested tree by dotted key", () => {
    expect(resolveBundleKey(bundle.projects, "fields.status")).toBe("ሁኔታ");
    expect(resolveBundleKey(bundle.enums, "projectStatus.active")).toBe("ንቁ");
  });

  it("returns undefined for a missing path or a non-string leaf", () => {
    expect(resolveBundleKey(bundle.projects, "fields.missing")).toBeUndefined();
    expect(resolveBundleKey(bundle.projects, "fields")).toBeUndefined();
  });
});

describe("bundleLocalizeContext", () => {
  it("localizes a generated schema from a raw locale bundle", () => {
    const localized = localizeFormSchema(factory(), bundleLocalizeContext(bundle, "projects"));
    const field = localized.fields[0];
    expect(field.label).toBe("ሁኔታ");
    expect(field.placeholder).toBe("ሁኔታ ይምረጡ");
    expect(field.options?.[0]).toEqual({ label: "ንቁ", value: "active" });
  });

  it("keeps the generated string when the namespace or key is absent", () => {
    const localized = localizeFormSchema(factory(), bundleLocalizeContext(bundle, "unknownNs"));
    expect(localized.fields[0].label).toBe("Status (generated)");
  });
});
