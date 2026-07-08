import { afterEach } from "vitest";

// The exact prefix the i18n layer's missing-key reporter console.warns. The
// reporter never throws (even at level "error"), which lets gaps pile up
// silently in stderr — the guard turns each one into a named test failure.
const missingKeyPrefix = "[i18n] MISSING";

export type MissingTranslationInterceptor = {
  /** Returns true when the warn call was a missing-key report (swallowed). */
  handleWarn: (args: readonly unknown[]) => boolean;
  /** The failure message for keys collected since the last take — and resets. */
  takeReport: () => string | undefined;
};

/** The interception/report logic, separated from console wiring for testability. */
export function createMissingTranslationInterceptor(): MissingTranslationInterceptor {
  const keys: string[] = [];
  return {
    handleWarn(args) {
      if (typeof args[0] === "string" && args[0].startsWith(missingKeyPrefix)) {
        keys.push(args[0]);
        return true;
      }
      return false;
    },
    takeReport() {
      if (keys.length === 0) {
        return undefined;
      }
      const unique = [...new Set(keys)];
      keys.length = 0;
      return (
        `this test rendered ${unique.length} missing translation key(s):\n  ${unique.join("\n  ")}\n` +
        "Add the key(s) to the app's translation resources (or fix the t() call)."
      );
    },
  };
}

/**
 * Missing translation keys FAIL the test that rendered them: intercepts the
 * i18n reporter's `[i18n] MISSING <lng> <ns>:<key>` console channel and throws
 * a named failure after each test that produced one.
 */
export function installMissingTranslationGuard(): void {
  const interceptor = createMissingTranslationInterceptor();
  /* eslint-disable no-console -- intercepting the i18n reporter's console channel is the point */
  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (!interceptor.handleWarn(args)) {
      originalWarn(...args);
    }
  };
  /* eslint-enable no-console */
  afterEach(() => {
    const report = interceptor.takeReport();
    if (report !== undefined) {
      throw new Error(report);
    }
  });
}
