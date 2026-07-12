import { useCallback, useRef, useState, type RefCallback } from "react";

export type ContainerWidthResult<E extends HTMLElement> = {
  /** Attach to the element whose width should drive layout decisions. */
  ref: RefCallback<E>;
  /**
   * Last measured content-box width of the element, in px. `undefined` until
   * the first measurement (initial render, SSR, or detached test DOMs) —
   * callers must pick an explicit unmeasured fallback rather than assume 0.
   */
  width: number | undefined;
};

/**
 * Measures an element's own width via ResizeObserver — the JS counterpart of
 * a CSS `@container` query for layout switches that live in logic rather than
 * classes (e.g. DataTable's table-to-cards switch). Components use this to
 * react to the container they were given, never to the viewport.
 */
export function useContainerWidth<E extends HTMLElement>(): ContainerWidthResult<E> {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const observerRef = useRef<ResizeObserver | undefined>(undefined);

  const ref = useCallback<RefCallback<E>>((element) => {
    observerRef.current?.disconnect();
    observerRef.current = undefined;
    if (!element) {
      return;
    }
    const measure = () => {
      const next = element.getBoundingClientRect().width;
      // jsdom (and detached nodes) measure 0 — keep "unmeasured" so callers
      // fall back to their wide/default layout instead of a phantom-narrow one.
      setWidth(next > 0 ? next : undefined);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observerRef.current = observer;
  }, []);

  return { ref, width };
}
