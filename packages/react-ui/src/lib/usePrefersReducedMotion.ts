import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function readPreference(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(reducedMotionQuery).matches;
}

/**
 * Reactive `prefers-reduced-motion: reduce` flag.
 *
 * Motion primitives consult this to skip entrance effects entirely — reduced
 * users get the final resting state immediately, never a hidden intermediate
 * frame. This complements the theme-level token collapse (theme.css shortens
 * the duration tokens to 1ms): the hook removes the *state machinery*, the
 * tokens neutralize any transition that still runs.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(readPreference);

  useEffect(() => {
    const mql = window.matchMedia(reducedMotionQuery);
    const onChange = () => setReduced(mql.matches);
    // Sync once on mount in case the preference changed between the initial
    // render and effect time (e.g. SSR markup hydrating on a reduced client).
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
