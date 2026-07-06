import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { createAppTranslations, TranslationProvider } from "../index";
import { i18n } from "../instance";

createAppTranslations({
  resources: { en: { common: { title: "Dashboard" } } },
});

function Title() {
  const { t, i18n: contextInstance } = useTranslation("common");
  return (
    <h1>
      {t("title")} ({contextInstance === i18n ? "shared" : "detached"})
    </h1>
  );
}

describe("TranslationProvider", () => {
  it("renders children with the shared singleton in context", async () => {
    render(
      <TranslationProvider>
        <Title />
      </TranslationProvider>,
    );
    expect(await screen.findByText("Dashboard (shared)")).toBeDefined();
  });
});
