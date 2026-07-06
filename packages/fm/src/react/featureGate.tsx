import type { ReactNode } from "react";
import { useFeature } from "./useFeature";

export type FeatureGateProps = {
  /** Feature to gate on; omitted → nearest ambient scope. */
  featureId?: string;
  /** Rendered instead of `children` while the feature is blocked (default: nothing). */
  whenBlocked?: ReactNode;
  /** Rendered instead of `children` while the feature is hidden (default: nothing). */
  whenHidden?: ReactNode;
  children: ReactNode;
};

/**
 * Renders its children only when the feature is ready. Unstyled by design —
 * styled upsell/lock surfaces belong to the app layer, which passes them as
 * `whenBlocked`.
 */
export function FeatureGate({
  featureId,
  whenBlocked = null,
  whenHidden = null,
  children,
}: FeatureGateProps) {
  const feature = useFeature(featureId);
  if (feature.status === "hidden") {
    return <>{whenHidden}</>;
  }
  if (feature.status === "blocked") {
    return <>{whenBlocked}</>;
  }
  return <>{children}</>;
}
