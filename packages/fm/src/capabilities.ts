import type { FeatureGateContext } from "@bota-apps/types/fm";

/**
 * The org-capabilities shape the platform GraphQL API returns. Apps pass their
 * generated capabilities type — it satisfies this structurally (a `plan` string,
 * plus keyed flag/limit/setup arrays), so no app-side re-typing is needed.
 */
export type OrgCapabilitiesInput = {
  plan: string;
  flags: readonly { key: string; enabled: boolean }[];
  limits: readonly { key: string; current: number; max: number }[];
  setupCompletion: readonly { key: string; completed: boolean }[];
};

/**
 * The pass-through gating inputs derived from capabilities — everything a
 * {@link FeatureGateContext} needs except `permissions` (those come from the
 * pruned resource tree, via `useFeatureSetup`).
 */
export type CapabilityFeatureInputs = Pick<
  FeatureGateContext,
  "flags" | "planFeatures" | "reachedLimits" | "approachingLimits" | "completedSetup"
>;

/** Fraction of a limit's max at which it is flagged "approaching" (a warning, never a gate). */
const approachingThreshold = 0.8;

/**
 * Map a platform capabilities object into the flat gating inputs `useFeatureSetup`
 * consumes: flag entries, plan-tier expansion (a tier grants every tier at or
 * below it in `planTierOrder`), exhausted (`reached`) and near-exhausted
 * (`approaching`) limits, and completed setup steps. Pure — spread the result
 * into `useFeatureSetup`. Only `planTierOrder` is app data; everything else is
 * generic capability→gating machinery, so apps stop re-implementing it.
 */
export function capabilitiesToFeatureInputs(
  capabilities: OrgCapabilitiesInput | undefined,
  planTierOrder: readonly string[],
): CapabilityFeatureInputs {
  if (!capabilities) {
    return {};
  }
  const planIndex = planTierOrder.indexOf(capabilities.plan);
  return {
    flags: Object.fromEntries(capabilities.flags.map((flag) => [flag.key, flag.enabled])),
    planFeatures: planIndex >= 0 ? planTierOrder.slice(0, planIndex + 1) : [],
    reachedLimits: capabilities.limits
      .filter((limit) => limit.current >= limit.max)
      .map((limit) => limit.key),
    approachingLimits: capabilities.limits
      .filter(
        (limit) =>
          limit.max > 0 &&
          limit.current < limit.max &&
          limit.current / limit.max > approachingThreshold,
      )
      .map((limit) => limit.key),
    completedSetup: capabilities.setupCompletion
      .filter((step) => step.completed)
      .map((step) => step.key),
  };
}
