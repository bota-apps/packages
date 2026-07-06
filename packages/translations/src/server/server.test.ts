import { describe, expect, it } from "vitest";
import { createAppTranslations } from "../createAppTranslations";
import { i18n } from "../instance";
import { getServerTranslation, serverI18n } from "./index";

createAppTranslations({
  resources: {
    en: { common: { greeting: "Hello" } },
    am: { common: { greeting: "ሰላም" } },
  },
});

describe("getServerTranslation", () => {
  it("returns a translator bound to the requested language", async () => {
    const t = await getServerTranslation("am", "common");
    expect(t("greeting", { ns: "common" })).toBe("ሰላም");

    const tEn = await getServerTranslation("en", "common");
    expect(tEn("greeting", { ns: "common" })).toBe("Hello");
  });

  it("exposes the shared singleton as serverI18n", () => {
    expect(serverI18n).toBe(i18n);
  });
});
