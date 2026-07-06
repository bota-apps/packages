import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createAppTranslations, TranslationProvider, useTranslations } from "../index";

createAppTranslations({
  resources: { en: { "app/common": { save: "Save" } } },
});

function SaveLabel() {
  const { t } = useTranslations("app/common");
  return <button>{t("save")}</button>;
}

describe("useTranslations", () => {
  it("translates against the shared singleton for the given namespace", async () => {
    render(
      <TranslationProvider>
        <SaveLabel />
      </TranslationProvider>,
    );
    expect(await screen.findByText("Save")).toBeDefined();
  });
});
