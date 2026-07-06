import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createAppTranslations, ScopedTranslatorProvider, useScopedTranslator } from "../index";
import { i18n } from "../instance";

createAppTranslations({
  resources: { en: { "tasks/nav": { projects: "Projects" } } },
});

function NavLabel() {
  const t = useScopedTranslator();
  return <span>{t ? t("projects") : "no-translator"}</span>;
}

describe("ScopedTranslatorProvider", () => {
  it("provides the bound translator to descendants", () => {
    render(
      <ScopedTranslatorProvider value={i18n.getFixedT(null, "tasks/nav")}>
        <NavLabel />
      </ScopedTranslatorProvider>,
    );
    expect(screen.getByText("Projects")).toBeDefined();
  });

  it("returns undefined outside the provider", () => {
    render(<NavLabel />);
    expect(screen.getByText("no-translator")).toBeDefined();
  });
});
