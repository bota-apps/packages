import type {
  CollectorVerdict,
  FeatureCollector,
  FeatureGateContext,
  FeatureNodeDef,
  FeatureStatus,
  ResolvedFeature,
  ResolvedFeatureNode,
} from "@bota-apps/types/fm";
import { defaultCollectors } from "./collectors";

// hidden beats blocked beats ready — the worst verdict along a path wins.
// Warning verdicts never escalate status; their reasons accumulate separately.
const statusSeverity: Record<FeatureStatus, number> = { ready: 0, blocked: 1, hidden: 2 };

type Gate = { status: FeatureStatus; reasons: readonly string[]; warnings: readonly string[] };

const openGate: Gate = { status: "ready", reasons: [], warnings: [] };

function mergeGate(gate: Gate, verdicts: readonly CollectorVerdict[]): Gate {
  return verdicts.reduce((acc, verdict) => {
    if (verdict.status === "warning") {
      return { ...acc, warnings: [...acc.warnings, ...verdict.reasons] };
    }
    return {
      status:
        statusSeverity[verdict.status] > statusSeverity[acc.status] ? verdict.status : acc.status,
      reasons: [...acc.reasons, ...verdict.reasons],
      warnings: acc.warnings,
    };
  }, gate);
}

function gateNode(
  node: FeatureNodeDef,
  inherited: Gate,
  context: FeatureGateContext,
  collectors: readonly FeatureCollector[],
): Gate {
  const verdicts = collectors
    .map((collect) => collect(node, context))
    .filter((verdict): verdict is CollectorVerdict => verdict !== undefined);
  return mergeGate(inherited, verdicts);
}

function toResolved(node: FeatureNodeDef, gate: Gate): ResolvedFeature {
  return {
    id: node.id,
    label: node.label ?? node.id,
    available: gate.status === "ready",
    visible: gate.status !== "hidden",
    status: gate.status,
    blockedBy: gate.reasons,
    warnedBy: gate.warnings,
    labels: node.labels ?? [],
    route: node.route,
    meta: node.meta,
  };
}

/**
 * The gating face of one node, in isolation: the collectors run against the
 * app-provided context and the worst verdict wins. With no context/collectors
 * every feature resolves ready.
 */
export function resolveFeature(
  node: FeatureNodeDef,
  context: FeatureGateContext = {},
  collectors: readonly FeatureCollector[] = defaultCollectors,
): ResolvedFeature {
  return toResolved(node, gateNode(node, openGate, context, collectors));
}

/**
 * Resolves the LAST node of a root→node chain with ancestor verdicts cascaded
 * in — a page inside a hidden module is hidden, whatever its own keys say.
 */
export function resolveFeaturePath(
  path: readonly FeatureNodeDef[],
  context: FeatureGateContext = {},
  collectors: readonly FeatureCollector[] = defaultCollectors,
): ResolvedFeature {
  if (!path.length) {
    throw new Error("resolveFeaturePath: empty path.");
  }
  const gate = path.reduce(
    (inherited, node) => gateNode(node, inherited, context, collectors),
    openGate,
  );
  return toResolved(path[path.length - 1], gate);
}

/**
 * Resolves a whole subtree, cascading each node's verdicts to its children —
 * the shape nav builders walk.
 */
export function resolveFeatureTree(
  node: FeatureNodeDef,
  context: FeatureGateContext = {},
  collectors: readonly FeatureCollector[] = defaultCollectors,
): ResolvedFeatureNode {
  const resolve = (current: FeatureNodeDef, inherited: Gate): ResolvedFeatureNode => {
    const gate = gateNode(current, inherited, context, collectors);
    return {
      ...toResolved(current, gate),
      children: (current.children ?? []).map((child) => resolve(child, gate)),
    };
  };
  return resolve(node, openGate);
}
