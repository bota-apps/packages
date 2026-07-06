import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import type { TypedRegistrationSchema } from "@bota-apps/types";
import { changeLanguage, createAppTranslations, TranslationProvider } from "../index";
import { localizedFormEntry, useLocalizedForm, useLocalizedFormSchema } from "./index";

createAppTranslations({
  resources: {
    en: {
      projects: { fields: { status: "Status" }, placeholders: { status: "Pick a status" } },
      enums: { projectStatus: { active: "Active" } },
    },
    am: {
      projects: { fields: { status: "ሁኔታ" }, placeholders: { status: "ሁኔታ ይምረጡ" } },
      enums: { projectStatus: { active: "ንቁ" } },
    },
  },
});

// A stable factory (as an app's imported schema function would be) so the hook's
// memoization can be observed across re-renders.
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

function wrapper({ children }: { children: ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>;
}

describe("useLocalizedFormSchema", () => {
  it("localizes field labels, placeholders, and enum options for the active language", async () => {
    await act(async () => {
      await changeLanguage("en");
    });

    const { result } = renderHook(() => useLocalizedFormSchema(factory, "projects"), { wrapper });
    const field = result.current.fields[0];

    expect(field.label).toBe("Status");
    expect(field.placeholder).toBe("Pick a status");
    expect(field.options?.[0]).toEqual({ label: "Active", value: "active" });
  });

  it("recomputes to Amharic on a language switch", async () => {
    await act(async () => {
      await changeLanguage("en");
    });
    const { result, rerender } = renderHook(() => useLocalizedFormSchema(factory, "projects"), {
      wrapper,
    });

    const englishSchema = result.current;
    expect(englishSchema.fields[0].label).toBe("Status");

    // Same language + same factory -> memoized identity is preserved.
    rerender();
    expect(result.current).toBe(englishSchema);

    await act(async () => {
      await changeLanguage("am");
    });

    expect(result.current).not.toBe(englishSchema);
    expect(result.current.fields[0].label).toBe("ሁኔታ");
    expect(result.current.fields[0].options?.[0]).toEqual({ label: "ንቁ", value: "active" });
  });
});

describe("localizedFormEntry + useLocalizedForm", () => {
  it("collect() derives the schema's requested keys, independent of the value type", () => {
    const entry = localizedFormEntry(factory, "projects");
    expect(entry.ns).toBe("projects");
    const keys = entry.collect();
    expect(keys.fieldKeys).toEqual(["fields.status"]);
    expect(keys.placeholderKeys).toEqual(["placeholders.status"]);
    expect(keys.enumKeys).toEqual(["projectStatus.active"]);
  });

  it("localizes the entry's schema for the active language via the hook", async () => {
    await act(async () => {
      await changeLanguage("am");
    });
    const entry = localizedFormEntry(factory, "projects");
    const { result } = renderHook(() => useLocalizedForm(entry), { wrapper });
    const field = result.current.fields[0];

    expect(field.label).toBe("ሁኔታ");
    expect(field.placeholder).toBe("ሁኔታ ይምረጡ");
    expect(field.options?.[0]).toEqual({ label: "ንቁ", value: "active" });
  });
});
