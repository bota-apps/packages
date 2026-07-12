import { useEffect, useRef, useState, type ReactNode } from "react";
import { Div, Li, Ol, Span } from "../html";
import { cn } from "../lib/utils";
import {
  stepFlowChipVariants,
  stepFlowDescriptionVariants,
  stepFlowFillVariants,
  stepFlowItemVariants,
  stepFlowListVariants,
  stepFlowRailVariants,
  stepFlowTitleRowVariants,
  stepFlowTitleVariants,
  stepFlowVariants,
  type StepFlowChipState,
} from "./variants";

export * from "./variants";

export type StepFlowStep = {
  /** Step heading. */
  title: ReactNode;
  /** Supporting copy under the title. */
  description?: ReactNode;
  /** Trailing slot beside the title (status badge, meta). */
  aside?: ReactNode;
};

export type StepFlowProps = {
  steps: StepFlowStep[];
  className?: string;
};

// Chip centers sit 1.25rem (20px) below each item's top edge (size-10 chips).
const chipCenterPx = 20;
// The reading line: a step counts as reached once its chip crosses this
// fraction of the viewport height.
const anchorFraction = 0.65;

function chipState(index: number, reachedIndex: number): StepFlowChipState {
  if (index < reachedIndex) {
    return "done";
  }
  if (index === reachedIndex) {
    return "active";
  }
  return "upcoming";
}

/**
 * StepFlow — a numbered vertical walkthrough whose progress rail fills as the
 * reader scrolls: passed steps solidify, the step at the reading line is
 * highlighted with the selected tokens, upcoming steps stay quiet. Built for
 * process storytelling — onboarding sequences, lifecycle walkthroughs,
 * "how it works" sections.
 *
 * All movement is scrubbed 1:1 by the reader's own scrolling (nothing moves
 * on its own), so it remains meaningful under reduced motion; the chip color
 * transitions collapse to instant via the motion tokens there.
 */
export function StepFlow({ steps, className }: StepFlowProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [reachedIndex, setReachedIndex] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    if (list === null) {
      return;
    }
    let frame = 0;
    const update = () => {
      const rect = list.getBoundingClientRect();
      if (rect.height <= 0) {
        return;
      }
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const anchor = viewportHeight * anchorFraction;
      setProgress(Math.min(1, Math.max(0, (anchor - rect.top) / rect.height)));
      let reached = -1;
      for (let index = 0; index < list.children.length; index += 1) {
        if (list.children[index].getBoundingClientRect().top + chipCenterPx <= anchor) {
          reached = index;
        }
      }
      setReachedIndex(reached);
    };
    const schedule = () => {
      if (frame !== 0) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    // Capture phase so scrolling inside nested scroll containers also updates.
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    };
  }, [steps.length]);

  return (
    <Div className={cn(stepFlowVariants(), className)}>
      <Div aria-hidden="true" className={stepFlowRailVariants()} />
      <Div
        aria-hidden="true"
        className={stepFlowFillVariants()}
        style={{ transform: `scaleY(${progress})` }}
      />
      <Ol ref={listRef} className={stepFlowListVariants()}>
        {steps.map((step, index) => (
          <Li key={index} className={stepFlowItemVariants()}>
            {/* The ol already conveys position to assistive technology. */}
            <Div
              aria-hidden="true"
              className={stepFlowChipVariants({ state: chipState(index, reachedIndex) })}
            >
              {String(index + 1).padStart(2, "0")}
            </Div>
            <Div grow>
              <Div className={stepFlowTitleRowVariants()}>
                <Span className={stepFlowTitleVariants()}>{step.title}</Span>
                {step.aside}
              </Div>
              {step.description !== undefined && (
                <Div className={stepFlowDescriptionVariants()}>{step.description}</Div>
              )}
            </Div>
          </Li>
        ))}
      </Ol>
    </Div>
  );
}
