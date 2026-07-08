// The vitest environment for page-level integration tests. An app's setup file
// (registered via `test.setupFiles`) is two lines:
//
//   import { installPageTestEnvironment } from "@bota-apps/testing/setup";
//   installPageTestEnvironment();
//
// Importing this module also registers the jest-dom matchers (`toBeVisible`,
// `toBeInTheDocument`, …) the route-smoke engine asserts with.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { installJsdomShims, type JsdomShimOptions } from "./jsdomShims";
import { installMissingTranslationGuard } from "./missingTranslations";

export { installJsdomShims, installMissingTranslationGuard };
export type { JsdomShimOptions };

export type PageTestEnvironmentOptions = JsdomShimOptions;

/**
 * Installs the full page-test environment: Testing Library cleanup between
 * tests, the missing-translation gate (a rendered `[i18n] MISSING` key fails
 * the test that produced it), and the jsdom shims the real provider stack
 * needs (matchMedia, ResizeObserver, pointer capture, a pinned desktop width).
 */
export function installPageTestEnvironment(options: PageTestEnvironmentOptions = {}): void {
  // Unmount between tests so each page render starts clean.
  afterEach(() => cleanup());
  installMissingTranslationGuard();
  installJsdomShims(options);
}
