import { beforeEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { createAppTranslations, TranslationProvider } from "../index";
import { i18n } from "../instance";

const en = {
  common: { greeting: "Hello", appName: "Tasks" },
  "tasks/nav": { projects: "Projects" },
};
const am = {
  common: { greeting: "ሰላም" },
};

const { useAppTranslations } = createAppTranslations({ resources: { en, am } });

function Greeting() {
  const { t } = useAppTranslations("common");
  return (
    <p>
      {t("greeting")} — {t("appName")}
    </p>
  );
}

function NavLabel() {
  const { t } = useAppTranslations("tasks/nav");
  return <p>{t("projects")}</p>;
}

function ActiveLanguage() {
  const { language } = useAppTranslations("common");
  return <p>lang:{language}</p>;
}

describe("createAppTranslations", () => {
  beforeEach(async () => {
    // Nothing is mounted here, so no act() wrapper is needed — and awaiting a
    // plain changeLanguage deterministically settles the singleton's async
    // init (initImmediate), which act()'s microtask flushing can otherwise race.
    await i18n.changeLanguage("en");
  });

  it("initializes the singleton and registers every namespace bundle", async () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.hasResourceBundle("en", "common")).toBe(true);
    expect(i18n.hasResourceBundle("en", "tasks/nav")).toBe(true);
    expect(i18n.hasResourceBundle("am", "common")).toBe(true);
  });

  it("returns a namespace-typed hook that translates", async () => {
    render(
      <TranslationProvider>
        <Greeting />
        <NavLabel />
      </TranslationProvider>,
    );
    expect(await screen.findByText("Hello — Tasks")).toBeDefined();
    expect(await screen.findByText("Projects")).toBeDefined();
  });

  it("re-renders on language switch and falls back to English for missing keys", async () => {
    render(
      <TranslationProvider>
        <Greeting />
      </TranslationProvider>,
    );
    expect(await screen.findByText("Hello — Tasks")).toBeDefined();

    await act(async () => {
      await i18n.changeLanguage("am");
    });
    // "greeting" is translated in Amharic; "appName" falls back to English.
    expect(await screen.findByText("ሰላም — Tasks")).toBeDefined();
  });

  it("exposes a reactive `language` accessor that mirrors the active language", async () => {
    render(
      <TranslationProvider>
        <ActiveLanguage />
      </TranslationProvider>,
    );
    expect(await screen.findByText("lang:en")).toBeDefined();

    await act(async () => {
      await i18n.changeLanguage("am");
    });
    expect(await screen.findByText("lang:am")).toBeDefined();
  });

  it("only registers additional bundles on subsequent calls", () => {
    const registered = createAppTranslations({
      resources: { en: { extras: { badge: "Extra" } } },
    });
    expect(registered.i18n).toBe(i18n);
    expect(i18n.t("badge", { ns: "extras" })).toBe("Extra");
    // Previously registered app bundles are untouched.
    expect(i18n.t("greeting", { ns: "common" })).toBe("Hello");
  });
});
