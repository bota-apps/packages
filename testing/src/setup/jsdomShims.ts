export type JsdomShimOptions = {
  /**
   * The viewport width pinned onto `documentElement.clientWidth` (default
   * 1280). jsdom does no layout, so unpinned it is always 0 — which makes
   * breakpoint hooks resolve to the smallest breakpoint and every DataTable
   * fall back to its mobile-card layout, hiding desktop-only surfaces like the
   * row-action menu.
   */
  desktopWidth?: number;
};

/**
 * jsdom gaps the real provider stack and Radix primitives touch — environment
 * shims, not app doubles: they no-op the browser-only bits so the real
 * components run. Node-env test files (`@vitest-environment node`) skip
 * silently.
 */
export function installJsdomShims(options: JsdomShimOptions = {}): void {
  if (typeof window === "undefined") {
    return;
  }
  const { desktopWidth = 1280 } = options;

  // AppearanceProvider reads matchMedia for theme detection.
  if (!window.matchMedia) {
    window.matchMedia = (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  // The shell (and Radix Popper / floating-ui) measure with ResizeObserver. An
  // inert observer is enough: jsdom elements always measure 0×0, so there is
  // never a resize to report.
  window.ResizeObserver ??= class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };

  // Radix menus/dialogs call these Pointer Capture + scroll APIs jsdom doesn't
  // implement; without them, opening a dropdown or dialog throws mid-interaction.
  const el = window.Element.prototype;
  el.hasPointerCapture ??= () => false;
  el.setPointerCapture ??= () => {};
  el.releasePointerCapture ??= () => {};
  el.scrollIntoView ??= () => {};

  Object.defineProperty(window.document.documentElement, "clientWidth", {
    configurable: true,
    value: desktopWidth,
  });
}
