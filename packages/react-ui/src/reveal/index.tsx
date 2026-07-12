import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Div } from "../html";
import { cn } from "../lib/utils";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { revealVariants, type RevealEffect } from "./variants";

export * from "./variants";

type RevealState = "initial" | "hidden" | "shown";

export type RevealProps = {
  /** Entrance pose to transition from. */
  effect?: RevealEffect;
  /** Extra transition delay in milliseconds — the staggering hook used by RevealGroup. */
  delayMs?: number;
  /** Fraction of the element that must be visible before the entrance runs. */
  threshold?: number;
  children: ReactNode;
  className?: string;
};

/**
 * Reveal — plays a one-time entrance (fade/slide/zoom on the motion tokens)
 * when the wrapped content first scrolls into view.
 *
 * Communicates arrival, not decoration: use it to introduce sections and
 * grouped content as the reader reaches them. Content is never hidden for
 * users the entrance cannot serve — server markup, reduced-motion users, and
 * browsers without IntersectionObserver all render the resting state
 * directly.
 */
export function Reveal({
  effect = "fadeUp",
  delayMs = 0,
  threshold = 0.15,
  children,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<RevealState>("initial");

  useEffect(() => {
    const el = ref.current;
    if (el === null || typeof IntersectionObserver === "undefined") {
      return;
    }
    if (reduced) {
      // A reduced preference arriving mid-flight must not strand hidden
      // content — settle on the resting state.
      setState("initial");
      return;
    }
    let revealed = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!revealed && entries.some((entry) => entry.isIntersecting)) {
          revealed = true;
          setState("shown");
          io.disconnect();
        }
      },
      { threshold },
    );
    // Elements already in view flip hidden→shown within a frame, so the
    // entrance also plays for above-the-fold content on first paint.
    setState((prev) => (prev === "shown" ? prev : "hidden"));
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold]);

  return (
    <Div
      ref={ref}
      className={cn(revealVariants({ effect, state }), className)}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Div>
  );
}

export type RevealGroupProps = {
  /** Entrance pose shared by every child. */
  effect?: RevealEffect;
  /** Stagger between consecutive children in milliseconds. */
  intervalMs?: number;
  /** Fraction of each child that must be visible before its entrance runs. */
  threshold?: number;
  /** Class applied to each generated wrapper (e.g. `h-full` inside an equal-height grid). */
  itemClassName?: string;
  children: ReactNode;
};

/**
 * RevealGroup — wraps each direct child in a `Reveal` with an incrementing
 * delay, so lists and card grids cascade in reading order instead of popping
 * in at once. Renders no wrapper of its own: place it inside the layout
 * container (Grid, Stack, …) that arranges the children.
 */
export function RevealGroup({
  effect = "fadeUp",
  intervalMs = 90,
  threshold,
  itemClassName,
  children,
}: RevealGroupProps) {
  return (
    <>
      {Children.map(children, (child, index) => (
        <Reveal
          effect={effect}
          delayMs={index * intervalMs}
          threshold={threshold}
          className={itemClassName}
        >
          {child}
        </Reveal>
      ))}
    </>
  );
}
