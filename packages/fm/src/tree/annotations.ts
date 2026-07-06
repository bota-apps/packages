import type { FeatureAnnotation, FeatureLabelKind, ResolvedFeature } from "@bota-apps/types/fm";

/** Every lifecycle badge kind — for apps building typed kind→variant maps. */
export const featureLabelKinds: readonly FeatureLabelKind[] = [
  "beta",
  "new",
  "comingSoon",
  "deprecated",
  "preview",
  "addon",
];

function toAnnotation(severity: FeatureAnnotation["severity"], reason: string): FeatureAnnotation {
  const separator = reason.indexOf(":");
  if (separator === -1) {
    return { severity, collector: reason, reason, detail: "" };
  }
  return {
    severity,
    collector: reason.slice(0, separator),
    reason,
    detail: reason.slice(separator + 1),
  };
}

/**
 * Splits a feature's namespaced reasons into renderable annotations — blocking
 * reasons first (in collector order), then warnings. Badge/banner/tooltip
 * surfaces map `collector` to copy; `detail` keys any app-side data lookup
 * (e.g. usage numbers for a limit).
 */
export function deriveFeatureAnnotations(feature: ResolvedFeature): readonly FeatureAnnotation[] {
  return [
    ...feature.blockedBy.map((reason) => toAnnotation("blocking", reason)),
    ...feature.warnedBy.map((reason) => toAnnotation("warning", reason)),
  ];
}
