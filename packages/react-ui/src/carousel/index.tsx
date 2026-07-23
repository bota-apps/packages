import {
  Children,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../button";
import { Div } from "../html/div";
import { Span } from "../html/span";
import { cn } from "../lib/utils";
import {
  carouselFooterVariants,
  carouselPositionVariants,
  carouselSlideVariants,
  carouselStageVariants,
  carouselVariants,
  type CarouselStageSize,
} from "./variants";

export type CarouselProps = {
  /** The slides. One child = one slide; the pager only renders for two or more. */
  children: ReactNode;
  /** Controlled index of the active slide. Pair with `onIndexChange`. */
  index?: number;
  /** Initial slide for the uncontrolled mode. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Accessible name announced for the carousel region. */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** "n of m" pager readout. Override for non-English apps. */
  positionLabel?: (position: number, total: number) => string;
  /**
   * Where arrow-key paging listens. `within` (default) pages while focus is
   * inside the carousel. `document` pages from anywhere — for modal dialog
   * hosts, where focus may sit on dialog chrome outside the carousel; the
   * modal traps focus, so while it is open the arrows belong to it.
   */
  arrowKeys?: "within" | "document";
  stageSize?: CarouselStageSize;
};

/**
 * Pages through its children one slide at a time: previous/next buttons, an
 * "n of m" readout, and arrow-key paging. With a single slide the stage
 * renders alone — no pager. Pager buttons at either end stay focusable
 * (`aria-disabled`, not `disabled`) so keyboard focus never drops to the
 * body mid-interaction.
 */
export function Carousel({
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  label,
  previousLabel = "Previous",
  nextLabel = "Next",
  positionLabel = (position, total) => `${position} of ${total}`,
  arrowKeys = "within",
  stageSize,
}: CarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const rawIndex = index ?? internalIndex;
  // Clamp so a shrinking slide set (or a stale controlled value) never
  // leaves the stage empty.
  const current = Math.min(Math.max(rawIndex, 0), Math.max(count - 1, 0));
  const atStart = current === 0;
  const atEnd = current === count - 1;

  const setIndex = (next: number) => {
    if (index === undefined) {
      setInternalIndex(next);
    }
    onIndexChange?.(next);
  };

  const goPrevious = () => {
    if (!atStart) {
      setIndex(current - 1);
    }
  };
  const goNext = () => {
    if (!atEnd) {
      setIndex(current + 1);
    }
  };

  useEffect(() => {
    if (arrowKeys !== "document" || count <= 1) {
      return undefined;
    }
    const page = (next: number) => {
      if (index === undefined) {
        setInternalIndex(next);
      }
      onIndexChange?.(next);
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowLeft" && current > 0) {
        event.preventDefault();
        page(current - 1);
      }
      if (event.key === "ArrowRight" && current < count - 1) {
        event.preventDefault();
        page(current + 1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [arrowKeys, count, current, index, onIndexChange]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (arrowKeys !== "within" || event.defaultPrevented) {
      return;
    }
    if (event.key === "ArrowLeft" && !atStart) {
      event.preventDefault();
      goPrevious();
    }
    if (event.key === "ArrowRight" && !atEnd) {
      event.preventDefault();
      goNext();
    }
  };

  if (count === 0) {
    return null;
  }

  return (
    <Div
      className={carouselVariants()}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      <Div className={carouselStageVariants({ size: stageSize })}>
        <Div
          key={current}
          className={carouselSlideVariants()}
          role="group"
          aria-roledescription="slide"
          aria-label={positionLabel(current + 1, count)}
        >
          {slides[current]}
        </Div>
      </Div>
      {count > 1 && (
        <Div className={carouselFooterVariants()}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={previousLabel}
            aria-disabled={atStart}
            className={cn(atStart && "pointer-events-none opacity-50")}
            onClick={goPrevious}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Span className={carouselPositionVariants()} aria-live="polite">
            {positionLabel(current + 1, count)}
          </Span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={nextLabel}
            aria-disabled={atEnd}
            className={cn(atEnd && "pointer-events-none opacity-50")}
            onClick={goNext}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </Div>
      )}
    </Div>
  );
}

export * from "./variants";
