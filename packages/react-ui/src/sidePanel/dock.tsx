/**
 * SidePanelDock — one shared right-hand column that stacks every open
 * SidePanel instead of laying panels out side by side.
 *
 * Wrap the app in SidePanelDockProvider and mount <SidePanelDock /> in the
 * layout's panel slot; every SidePanel rendered under the provider then
 * portals itself into the dock (wherever it appears in the tree). Open panels
 * split the column height, the width controls adjust the one shared column,
 * and the dock disappears entirely while nothing is open. Closed panels stay
 * mounted inside the hidden dock, so their state survives exactly as it does
 * for a standalone SidePanel.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { sidePanelWidthClasses, type SidePanelWidth } from "./variants";

type SidePanelDockContextValue = {
  /** The dock's DOM container — panels portal here once it mounts. */
  node: HTMLElement | null;
  setNode: (node: HTMLElement | null) => void;
  /** How many registered panels are currently open. */
  openCount: number;
  /** Panels report their open state so the dock can show, hide, and size itself. */
  reportOpen: (id: string, open: boolean) => void;
  forget: (id: string) => void;
  /** The one column width every stacked panel shares. */
  width: SidePanelWidth;
  setWidth: (width: SidePanelWidth) => void;
};

const SidePanelDockContext = createContext<SidePanelDockContextValue | null>(null);

/** The ambient dock, if any — how SidePanel discovers it should stack. */
export function useSidePanelDock(): SidePanelDockContextValue | null {
  return useContext(SidePanelDockContext);
}

type SidePanelDockProviderProps = {
  children: ReactNode;
  /** Column width preset the dock starts at (panel width controls adjust it). */
  defaultWidth?: SidePanelWidth;
};

export function SidePanelDockProvider({
  children,
  defaultWidth = "md",
}: SidePanelDockProviderProps) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [openIds, setOpenIds] = useState<readonly string[]>([]);
  const [width, setWidth] = useState<SidePanelWidth>(defaultWidth);

  // Both callbacks return the same array when nothing changes, so the
  // re-registration every SidePanel runs on re-render never loops the state.
  const reportOpen = useCallback((id: string, open: boolean) => {
    setOpenIds((current) => {
      if (current.includes(id) === open) {
        return current;
      }
      return open ? [...current, id] : current.filter((existing) => existing !== id);
    });
  }, []);
  const forget = useCallback((id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((existing) => existing !== id) : current,
    );
  }, []);

  const value = useMemo(
    () => ({ node, setNode, openCount: openIds.length, reportOpen, forget, width, setWidth }),
    [node, openIds.length, reportOpen, forget, width],
  );
  return <SidePanelDockContext.Provider value={value}>{children}</SidePanelDockContext.Provider>;
}

/**
 * The dock column itself — mount once in the layout's panel slot. Below `md`
 * it stays out of layout (panels overlay the viewport on their own); from `md`
 * up it is the sticky card column the panels stack inside, dividers between
 * open panels, hidden while none is open.
 */
export function SidePanelDock({ className }: { className?: string }) {
  const dock = useSidePanelDock();
  if (!dock) {
    return null;
  }
  const open = dock.openCount > 0;
  return (
    <div
      ref={dock.setNode}
      data-state={open ? "open" : "closed"}
      className={cn(
        "contents",
        open
          ? [
              "md:sticky md:top-0 md:flex md:max-h-dvh md:min-h-0 md:shrink-0 md:flex-col md:self-stretch",
              "md:divide-y md:divide-border md:border-l md:border-border md:bg-card md:text-card-foreground md:shadow-overlay",
              "md:transition-[width] md:duration-200",
              sidePanelWidthClasses[dock.width],
            ]
          : "md:hidden",
        className,
      )}
    />
  );
}
