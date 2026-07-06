import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Badge, Inline } from "@bota-apps/react-ui";
import { useFeature } from "@bota-apps/fm";
import { isLucideIcon } from "../navigation";
import { RouteLink, toRoutePath } from "../routeLink";

type FeatureCardProps = {
  featureId: string;
  /** Card body text (the feature node only carries the label). */
  description?: string;
  /** Extra right-side adornment rendered before the gating badge. */
  suffix?: ReactNode;
  /** Badge text on blocked features (default "Upgrade"). */
  blockedLabel?: string;
};

/**
 * Navigation-hub card resolved from the feature tree: label, route, and icon
 * come from the node (`meta.icon`); gating renders as a badge. Hidden features
 * (and nodes without a route or icon) render nothing.
 */
export function FeatureCard({
  featureId,
  description,
  suffix,
  blockedLabel = "Upgrade",
}: FeatureCardProps) {
  const feature = useFeature(featureId);

  if (feature.status === "hidden" || !feature.route) {
    return null;
  }

  const icon = feature.meta?.icon;
  if (!isLucideIcon(icon)) {
    return null;
  }

  const blockedBadge =
    feature.status === "blocked" ? (
      <Badge variant="warning">
        <Inline gap="xs" align="center">
          <Lock size={12} />
          {blockedLabel}
        </Inline>
      </Badge>
    ) : null;

  return (
    <RouteLink
      variant="quick-link"
      to={toRoutePath(feature.route)}
      icon={icon}
      label={feature.label}
      description={description}
      suffix={
        suffix || blockedBadge ? (
          <Inline gap="xs" align="center">
            {suffix}
            {blockedBadge}
          </Inline>
        ) : undefined
      }
    />
  );
}
