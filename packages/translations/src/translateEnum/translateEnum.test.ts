import { describe, expect, it } from "vitest";
import { createInstance } from "i18next";
import { translateEnum } from "./index";

async function makeT() {
  const instance = createInstance({
    lng: "en",
    nsSeparator: false,
    resources: {
      en: {
        translation: {
          status: { active: "Active", onLeave: "On leave" },
        },
      },
    },
  });
  await instance.init();
  return instance.t;
}

describe("translateEnum", () => {
  it("maps enum values to { value, label } options with translated labels", async () => {
    const t = await makeT();
    expect(translateEnum(["active", "onLeave"], t, "status")).toEqual([
      { value: "active", label: "Active" },
      { value: "onLeave", label: "On leave" },
    ]);
  });

  it("falls back to the lookup key for untranslated values", async () => {
    const t = await makeT();
    expect(translateEnum(["archived"], t, "status")).toEqual([
      { value: "archived", label: "status.archived" },
    ]);
  });

  it("returns an empty list for no values", async () => {
    const t = await makeT();
    expect(translateEnum([], t, "status")).toEqual([]);
  });
});
