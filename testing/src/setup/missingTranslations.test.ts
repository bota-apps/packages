import { describe, expect, it } from "vitest";
import { createMissingTranslationInterceptor } from "./missingTranslations";

describe("createMissingTranslationInterceptor", () => {
  it("swallows missing-key reports and passes every other warn through", () => {
    const interceptor = createMissingTranslationInterceptor();
    expect(interceptor.handleWarn(["[i18n] MISSING en payroll/runs:actions.create"])).toBe(true);
    expect(interceptor.handleWarn(["some unrelated warning"])).toBe(false);
    expect(interceptor.handleWarn([new Error("non-string first arg")])).toBe(false);
  });

  it("reports collected keys once, deduplicated, then resets", () => {
    const interceptor = createMissingTranslationInterceptor();
    interceptor.handleWarn(["[i18n] MISSING en a:one"]);
    interceptor.handleWarn(["[i18n] MISSING en a:one"]);
    interceptor.handleWarn(["[i18n] MISSING en b:two"]);

    const report = interceptor.takeReport();
    expect(report).toContain("2 missing translation key(s)");
    expect(report).toContain("[i18n] MISSING en a:one");
    expect(report).toContain("[i18n] MISSING en b:two");
    expect(interceptor.takeReport()).toBeUndefined();
  });

  it("reports nothing when no key was rendered", () => {
    expect(createMissingTranslationInterceptor().takeReport()).toBeUndefined();
  });
});
