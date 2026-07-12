import { useEffect, useRef, useState } from "react";
import { Span } from "../html";
import { cn } from "../lib/utils";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import {
  animatedNumberSizerVariants,
  animatedNumberValueVariants,
  animatedNumberVariants,
} from "./variants";

export * from "./variants";

// Module-scope formatter — Intl construction is ~10–100× the cost of
// .format() and this default runs per animation frame.
const defaultNumberFormatter = new Intl.NumberFormat("en");
const defaultFormat = (value: number): string => defaultNumberFormatter.format(value);

export type AnimatedNumberProps = {
  /** The value to settle on. Changing it tweens from the currently displayed value. */
  value: number;
  /** Tween length in milliseconds. */
  durationMs?: number;
  /** Formats every painted frame AND the accessible value. Defaults to en-locale grouping. */
  format?: (value: number) => string;
  className?: string;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * AnimatedNumber — counts up to `value` when it first scrolls into view, and
 * tweens between values on updates. Communicates magnitude for stat rows and
 * metric callouts.
 *
 * - The box is sized by the final value, so the count-up causes no layout
 *   shift; digits use tabular figures.
 * - Assistive technology always reads the final value — the ticking frames
 *   are aria-hidden.
 * - Reduced-motion users (and environments without IntersectionObserver or
 *   rAF) see the final value immediately.
 */
export function AnimatedNumber({
  value,
  durationMs = 1000,
  format = defaultFormat,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(0);
  // Mirrors `display` so a value change tweens from wherever the previous
  // tween left off without retriggering the effect on every frame.
  const displayRef = useRef(0);

  // Arm on first intersection so below-the-fold counters run when reached,
  // not silently on mount.
  useEffect(() => {
    const el = ref.current;
    if (started) {
      return;
    }
    if (el === null || typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) {
      return;
    }
    const from = displayRef.current;
    if (
      reduced ||
      durationMs <= 0 ||
      from === value ||
      typeof requestAnimationFrame === "undefined"
    ) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }
    // Integer endpoints tick through integers; fractional endpoints keep the
    // raw tween value and let `format` round.
    const integers = Number.isInteger(from) && Number.isInteger(value);
    const startedAt = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      const t = Math.min((now - startedAt) / durationMs, 1);
      const next = from + (value - from) * easeOutCubic(t);
      const snapped = t >= 1 ? value : integers ? Math.round(next) : next;
      displayRef.current = snapped;
      setDisplay(snapped);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    });
    // Guard against superseded tweens: a newer value (or unmount) cancels the
    // in-flight frame so a stale tween never overwrites the fresh one.
    return () => cancelAnimationFrame(frame);
  }, [started, value, reduced, durationMs]);

  const finalText = format(value);
  return (
    <Span ref={ref} className={cn(animatedNumberVariants(), className)}>
      <Span aria-hidden="true" className={animatedNumberSizerVariants()}>
        {finalText}
      </Span>
      <Span aria-hidden="true" className={animatedNumberValueVariants()}>
        {format(display)}
      </Span>
      <Span display="srOnly">{finalText}</Span>
    </Span>
  );
}
