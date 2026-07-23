/**
 * SidePanel — a non-modal companion panel docked to the right edge of a
 * layout. Unlike Sheet/Dialog it takes no focus trap and paints no backdrop:
 * the rest of the app stays interactive (and, from `md` up, visible beside
 * it) while the panel is open, so users can navigate around the app to gather
 * context without losing what they typed.
 *
 * Children stay mounted while the panel is closed (`hidden`), so in-progress
 * form state survives close/reopen cycles by construction.
 */
import { useState, type ReactNode } from "react";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { Button } from "../button";
import { Text } from "../html/typography";
import { VisuallyHidden } from "../visuallyHidden";
import { sidePanelVariants, sidePanelWidths, type SidePanelWidth } from "./variants";

export * from "./variants";

export type SidePanelProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Panel heading; also the region's accessible name. */
  title: string;
  description?: string;
  /** Controlled width preset; omit for internal state starting at `defaultWidth`. */
  width?: SidePanelWidth;
  defaultWidth?: SidePanelWidth;
  onWidthChange?: (width: SidePanelWidth) => void;
  /**
   * Show the widen/narrow controls (`md` and up only — below that the panel
   * is viewport-wide and resizing is meaningless). Default true.
   */
  widthControls?: boolean;
  /** Accessible labels for the built-in controls. */
  closeLabel?: string;
  widenLabel?: string;
  narrowLabel?: string;
  /**
   * Pinned action row below the scrollable body (e.g. cancel/submit). Stays
   * visible however long the content grows.
   */
  footer?: ReactNode;
  children: ReactNode;
};

export function SidePanel({
  open,
  onOpenChange,
  title,
  description,
  width: widthProp,
  defaultWidth = "md",
  onWidthChange,
  widthControls = true,
  closeLabel = "Close panel",
  widenLabel = "Widen panel",
  narrowLabel = "Narrow panel",
  footer,
  children,
}: SidePanelProps) {
  const [uncontrolledWidth, setUncontrolledWidth] = useState<SidePanelWidth>(defaultWidth);
  const width = widthProp ?? uncontrolledWidth;

  const widthIndex = sidePanelWidths.indexOf(width);
  const setWidth = (next: SidePanelWidth) => {
    if (widthProp === undefined) {
      setUncontrolledWidth(next);
    }
    onWidthChange?.(next);
  };

  return (
    <aside
      role="complementary"
      aria-label={title}
      data-state={open ? "open" : "closed"}
      // Closed means gone: the children stay mounted (drafts survive), but
      // the region leaves the accessibility tree and tab order entirely —
      // the CSS `hidden` alone wouldn't do that in every environment.
      hidden={!open}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
      className={sidePanelVariants({ width, open })}
    >
      {/* Sticky wrapper: the panel column spans the whole content row, but the
          visible chrome pins itself to the viewport while the page scrolls. */}
      <div className="flex h-full max-h-dvh flex-col md:sticky md:top-0">
        <header className="flex items-start gap-1 border-b border-border px-4 py-3">
          <div className="min-w-0 flex-1">
            <Text as="h2" size="md" weight="semibold" className="truncate">
              {title}
            </Text>
            {description !== undefined && (
              <Text as="p" size="sm" tone="muted">
                {description}
              </Text>
            )}
          </div>
          {widthControls && (
            <div className="hidden shrink-0 items-center md:flex">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={widthIndex >= sidePanelWidths.length - 1}
                onClick={() => setWidth(sidePanelWidths[widthIndex + 1])}
              >
                <ChevronsLeft />
                <VisuallyHidden>{widenLabel}</VisuallyHidden>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={widthIndex <= 0}
                onClick={() => setWidth(sidePanelWidths[widthIndex - 1])}
              >
                <ChevronsRight />
                <VisuallyHidden>{narrowLabel}</VisuallyHidden>
              </Button>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onOpenChange?.(false)}
          >
            <X />
            <VisuallyHidden>{closeLabel}</VisuallyHidden>
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer !== undefined && (
          <footer className="border-t border-border bg-muted/30 px-4 py-3">{footer}</footer>
        )}
      </div>
    </aside>
  );
}
