import type { FeatureCollector } from "@bota-apps/types/fm";

// The generic gating collectors. Each reads one declarative key off the node
// and vetoes against the app-provided FeatureGateContext; a node without that
// key always passes. Gated nodes fail CLOSED: a missing context field means
// "nothing granted/enabled", never "allow". Hidden vs blocked is the split
// between "don't advertise" (flags, permissions) and "advertise but gate"
// (plan, limit, setup — the upsell/onboarding surfaces).

/** Hides the node unless its feature flag is explicitly on. */
export const flagCollector: FeatureCollector = (node, context) => {
  if (!node.flag || context.flags?.[node.flag] === true) {
    return undefined;
  }
  return { status: "hidden", reasons: [`flag:${node.flag}`] };
};

/** Hides the node unless every required permission is granted. */
export const permissionCollector: FeatureCollector = (node, context) => {
  if (!node.permissions?.length) {
    return undefined;
  }
  const granted = new Set(context.permissions ?? []);
  const missing = node.permissions.filter((permission) => !granted.has(permission));
  if (!missing.length) {
    return undefined;
  }
  return { status: "hidden", reasons: missing.map((permission) => `permission:${permission}`) };
};

/** Blocks the node unless the current plan includes its feature key. */
export const planCollector: FeatureCollector = (node, context) => {
  if (!node.planFeature || context.planFeatures?.includes(node.planFeature)) {
    return undefined;
  }
  return { status: "blocked", reasons: [`plan:${node.planFeature}`] };
};

/**
 * Blocks the node while its usage limit is reached; warns (without gating)
 * while the limit is merely approaching.
 */
export const limitCollector: FeatureCollector = (node, context) => {
  if (!node.limit) {
    return undefined;
  }
  if (context.reachedLimits?.includes(node.limit)) {
    return { status: "blocked", reasons: [`limit:${node.limit}`] };
  }
  if (context.approachingLimits?.includes(node.limit)) {
    return { status: "warning", reasons: [`limit:${node.limit}`] };
  }
  return undefined;
};

/** Blocks the node until its setup step is complete. */
export const setupCollector: FeatureCollector = (node, context) => {
  if (!node.setup || context.completedSetup?.includes(node.setup)) {
    return undefined;
  }
  return { status: "blocked", reasons: [`setup:${node.setup}`] };
};

export const defaultCollectors: readonly FeatureCollector[] = [
  flagCollector,
  permissionCollector,
  planCollector,
  limitCollector,
  setupCollector,
];
