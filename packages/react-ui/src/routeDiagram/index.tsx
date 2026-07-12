/**
 * RouteDiagram — a 2D SVG diagram of a staged journey: an ordered set of nodes
 * (points) joined by labelled legs (segments), each node and leg carrying a
 * generic progress status (`complete` / `current` / `upcoming`). It generalises
 * the "where is this in its route" markup — stage trackers, multi-leg route
 * maps, hop-by-hop progress — into one shared primitive. Callers map their own
 * domain state onto the three generic positions; the component knows no routes,
 * modes, or labels of its own.
 *
 * Rendering:
 *   - the visual is a single `<svg>` (marks + labels drawn as SVG geometry and
 *     `<text>`), marked `aria-hidden` — it is decorative-with-semantics.
 *   - the accessible + printable representation is a real ordered `<ol>` of legs
 *     ("Origin to Hub via Segment 1 — Complete"), visually hidden on screen and
 *     revealed in print. Screen readers and print get the route without the SVG.
 *
 * Status is never colour-only: node markers differ in shape (checked disc /
 * ringed target / hollow outline) and every node shows a text status caption,
 * while the legs summary spells each leg's status out in words.
 *
 * Responsive: the root is a `@container` scope. A vertical diagram is narrow-
 * friendly as-is; a horizontal diagram renders the horizontal SVG at `@md` and
 * up and swaps to a stacked vertical SVG below `@md`, where a row would overflow
 * (the horizontal SVG additionally scrolls in `overflow-x-auto` when very wide).
 *
 * Motion: legs draw in on mount via a CSS `stroke-dashoffset` transition. Under
 * `prefers-reduced-motion` (or `animate={false}`) the final drawn state renders
 * immediately with no transition — no motion library, no hidden intermediate.
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Div, Li, Ol, Span } from "../html";
import { cn } from "../lib/utils";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import {
  routeDiagramVariants,
  routeLegVariants,
  routeNodeVariants,
  type RouteStatus,
} from "./variants";

export * from "./variants";

export type RouteNode = {
  id: string;
  label: ReactNode;
  sublabel?: ReactNode;
  status?: RouteStatus;
};

export type RouteLeg = {
  id: string;
  /** Node id this leg departs. */
  from: string;
  /** Node id this leg arrives. */
  to: string;
  /** Optional descriptor for the leg (e.g. a mode or a duration). */
  label?: ReactNode;
  status?: RouteStatus;
};

export type RouteDiagramProps = {
  nodes: readonly RouteNode[];
  legs: readonly RouteLeg[];
  orientation?: "horizontal" | "vertical";
  /** Draw legs in on mount. Defaults to `true`; ignored under reduced motion. */
  animate?: boolean;
  /** Accessible name for the legs summary list. */
  ariaLabel?: string;
  /** English by default; override to localize the status words. */
  statusLabels?: Partial<Record<RouteStatus, string>>;
};

const defaultStatusLabels: Record<RouteStatus, string> = {
  complete: "Complete",
  current: "Current",
  upcoming: "Upcoming",
};

// ---- Layout constants (SVG user units) --------------------------------------

const markerR = 11;

const horizontal = {
  padX: 70,
  stepX: 150,
  lineY: 46,
  height: 120,
  legLabelY: 28,
  labelY: 74,
  sublabelY: 90,
  statusY: 105,
} as const;

const vertical = {
  width: 260,
  markerX: 22,
  padY: 30,
  stepY: 92,
  labelX: 44,
  labelDy: -4,
  sublabelDy: 11,
  statusDy: 25,
  legLabelDx: 44,
} as const;

type Point = { x: number; y: number };

function nodePoint(index: number, orientation: "horizontal" | "vertical"): Point {
  if (orientation === "horizontal") {
    return { x: horizontal.padX + index * horizontal.stepX, y: horizontal.lineY };
  }
  return { x: vertical.markerX, y: vertical.padY + index * vertical.stepY };
}

function checkPath(cx: number, cy: number): string {
  return `M ${cx - 4.5} ${cy + 0.5} l 3 3 l 6 -6.5`;
}

/** Node marker — shape differs per status so meaning survives without colour. */
function NodeMark({ status, point }: { status: RouteStatus; point: Point }) {
  if (status === "complete") {
    return (
      <g>
        <circle
          cx={point.x}
          cy={point.y}
          r={markerR}
          strokeWidth={2}
          className={cn(routeNodeVariants({ status }))}
        />
        <path
          d={checkPath(point.x, point.y)}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fill-none stroke-primary-foreground"
        />
      </g>
    );
  }
  if (status === "current") {
    return (
      <g>
        <circle
          cx={point.x}
          cy={point.y}
          r={markerR}
          strokeWidth={2.5}
          className={cn(routeNodeVariants({ status }))}
        />
        <circle cx={point.x} cy={point.y} r={4} className="fill-primary stroke-none" />
      </g>
    );
  }
  return (
    <circle
      cx={point.x}
      cy={point.y}
      r={markerR}
      strokeWidth={2}
      className={cn(routeNodeVariants({ status }))}
    />
  );
}

type RouteSvgProps = {
  nodes: readonly RouteNode[];
  legs: readonly RouteLeg[];
  orientation: "horizontal" | "vertical";
  animate: boolean;
  labels: Record<RouteStatus, string>;
};

function RouteSvg({ nodes, legs, orientation, animate, labels }: RouteSvgProps) {
  const reduced = usePrefersReducedMotion();
  const shouldAnimate = animate && !reduced;
  const [revealed, setRevealed] = useState(!shouldAnimate);

  useEffect(() => {
    if (!shouldAnimate) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, [shouldAnimate]);

  const indexById = new Map(nodes.map((node, index) => [node.id, index]));
  const pointById = (id: string): Point => {
    const index = indexById.get(id);
    if (index === undefined) {
      throw new Error(`RouteDiagram: leg references unknown node id "${id}".`);
    }
    return nodePoint(index, orientation);
  };

  const count = nodes.length;
  const isHorizontal = orientation === "horizontal";
  const width = isHorizontal
    ? horizontal.padX * 2 + Math.max(1, count - 1) * horizontal.stepX
    : vertical.width;
  const height = isHorizontal
    ? horizontal.height
    : vertical.padY * 2 + Math.max(1, count - 1) * vertical.stepY;

  const legStyle = (index: number): CSSProperties => {
    if (!shouldAnimate) {
      return { strokeDasharray: 1, strokeDashoffset: 0 };
    }
    return {
      strokeDasharray: 1,
      strokeDashoffset: revealed ? 0 : 1,
      transition: `stroke-dashoffset 600ms ${index * 140}ms ease`,
    };
  };

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox={`0 0 ${width} ${height}`}
      width={isHorizontal ? width : "100%"}
      height={isHorizontal ? height : undefined}
      preserveAspectRatio="xMinYMin meet"
      className={isHorizontal ? "block" : "block h-auto w-full"}
    >
      {legs.map((leg, index) => {
        const from = pointById(leg.from);
        const to = pointById(leg.to);
        const status = leg.status ?? "upcoming";
        return (
          <g key={leg.id}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              pathLength={1}
              strokeWidth={2.5}
              strokeLinecap="round"
              style={legStyle(index)}
              className={cn(routeLegVariants({ status }))}
            />
            {leg.label !== undefined ? (
              <text
                x={isHorizontal ? (from.x + to.x) / 2 : from.x + vertical.legLabelDx}
                y={isHorizontal ? horizontal.legLabelY : (from.y + to.y) / 2}
                textAnchor={isHorizontal ? "middle" : "start"}
                dominantBaseline="middle"
                className="fill-muted-foreground text-[11px]"
              >
                {leg.label}
              </text>
            ) : undefined}
          </g>
        );
      })}

      {nodes.map((node, index) => {
        const point = nodePoint(index, orientation);
        const status = node.status ?? "upcoming";
        return (
          <g key={node.id}>
            <NodeMark status={status} point={point} />
            <text
              x={isHorizontal ? point.x : vertical.labelX}
              y={isHorizontal ? horizontal.labelY : point.y + vertical.labelDy}
              textAnchor={isHorizontal ? "middle" : "start"}
              dominantBaseline="middle"
              className="fill-foreground text-[13px] font-medium"
            >
              {node.label}
            </text>
            {node.sublabel !== undefined ? (
              <text
                x={isHorizontal ? point.x : vertical.labelX}
                y={isHorizontal ? horizontal.sublabelY : point.y + vertical.sublabelDy}
                textAnchor={isHorizontal ? "middle" : "start"}
                dominantBaseline="middle"
                className="fill-muted-foreground text-[11px]"
              >
                {node.sublabel}
              </text>
            ) : undefined}
            <text
              x={isHorizontal ? point.x : vertical.labelX}
              y={isHorizontal ? horizontal.statusY : point.y + vertical.statusDy}
              textAnchor={isHorizontal ? "middle" : "start"}
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px] uppercase tracking-wide"
            >
              {labels[status]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Semantic, printable legs summary — the accessible source of truth. */
function RouteSummary({
  nodes,
  legs,
  labels,
  ariaLabel,
}: {
  nodes: readonly RouteNode[];
  legs: readonly RouteLeg[];
  labels: Record<RouteStatus, string>;
  ariaLabel?: string;
}) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const labelFor = (id: string): ReactNode => {
    const node = nodeById.get(id);
    if (node === undefined) {
      throw new Error(`RouteDiagram: leg references unknown node id "${id}".`);
    }
    return node.label;
  };
  return (
    <Ol aria-label={ariaLabel} className="sr-only space-y-1 print:not-sr-only print:my-2">
      {legs.map((leg) => (
        <Li key={leg.id}>
          {labelFor(leg.from)}
          <Span>{" to "}</Span>
          {labelFor(leg.to)}
          {leg.label !== undefined ? (
            <>
              <Span>{" via "}</Span>
              {leg.label}
            </>
          ) : undefined}
          {leg.status !== undefined ? <Span>{` — ${labels[leg.status]}`}</Span> : undefined}
        </Li>
      ))}
    </Ol>
  );
}

export function RouteDiagram({
  nodes,
  legs,
  orientation = "horizontal",
  animate = true,
  ariaLabel,
  statusLabels,
}: RouteDiagramProps) {
  const labels = {
    complete: statusLabels?.complete ?? defaultStatusLabels.complete,
    current: statusLabels?.current ?? defaultStatusLabels.current,
    upcoming: statusLabels?.upcoming ?? defaultStatusLabels.upcoming,
  } satisfies Record<RouteStatus, string>;

  return (
    <Div className={cn(routeDiagramVariants())}>
      {orientation === "horizontal" ? (
        <>
          <Div className="hidden overflow-x-auto @md:block">
            <RouteSvg
              nodes={nodes}
              legs={legs}
              orientation="horizontal"
              animate={animate}
              labels={labels}
            />
          </Div>
          <Div className="@md:hidden">
            <RouteSvg
              nodes={nodes}
              legs={legs}
              orientation="vertical"
              animate={animate}
              labels={labels}
            />
          </Div>
        </>
      ) : (
        <RouteSvg
          nodes={nodes}
          legs={legs}
          orientation="vertical"
          animate={animate}
          labels={labels}
        />
      )}
      <RouteSummary nodes={nodes} legs={legs} labels={labels} ariaLabel={ariaLabel} />
    </Div>
  );
}
