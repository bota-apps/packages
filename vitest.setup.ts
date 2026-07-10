// Shared jsdom polyfills + Testing Library cleanup for every package's tests.
// Registered via `test.setupFiles` in vitest.config.ts and run once per test
// file. Stubs are installed by direct assignment (not vi.stubGlobal) so a test
// file's vi.unstubAllGlobals() cannot strip them; a per-file vi.stubGlobal
// still takes precedence for tests that need different behavior (for example
// themeProvider's theme-detection matchMedia) and restores back to these stubs.
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom lacks ResizeObserver (Radix Popper/floating-ui, Recharts'
// ResponsiveContainer, useBreakpoint). An inert observer is enough: jsdom
// elements always measure 0×0, so there is never a resize to report.
class ResizeObserverStub implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
globalThis.ResizeObserver = ResizeObserverStub;

// jsdom lacks matchMedia (theme detection, useBreakpoint). Report "no match"
// with the full MediaQueryList surface so both the modern and the deprecated
// listener APIs are callable.
globalThis.matchMedia = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// jsdom lacks IntersectionObserver (NavList's horizontal overflow measuring).
// An inert observer is enough: jsdom elements always measure 0×0, so nothing
// ever leaves or enters a root. Tests that drive overflow states install a
// controllable stub per file via vi.stubGlobal.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
globalThis.IntersectionObserver = IntersectionObserverStub;

// jsdom lacks the layout and pointer-capture APIs Radix primitives call
// (menus, select, toast swipe handling).
Element.prototype.scrollIntoView = () => {};
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};

// Explicit vitest imports (no globals) disable Testing Library's automatic
// cleanup, so register it once here instead of per test file.
afterEach(cleanup);
