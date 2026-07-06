import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import { Button, ButtonGroup, ErrorState } from "@bota-apps/react-ui";
import { useFeature } from "@bota-apps/fm";
import type { ResolvedFeature } from "@bota-apps/types/fm";
import { NotFound } from "../notFound";
import { PageContainer } from "../pageContainer";

export type FeatureBlockedCopy = {
  title: string;
  description: string;
  ctaLabel: string;
};

// Copy keyed by the collector prefix of the leading blockedBy reason
// ("plan:multi-currency" → plan). App-specific collectors fall through to the
// default copy, or the app overrides `copy` entirely.
const blockedCopyByCollector: Record<string, FeatureBlockedCopy> = {
  plan: {
    title: "Upgrade your plan",
    description: "This feature requires a higher plan. Upgrade to unlock it.",
    ctaLabel: "View Plans",
  },
  limit: {
    title: "Limit reached",
    description: "You've reached this feature's usage limit on your current plan.",
    ctaLabel: "View Plans",
  },
  setup: {
    title: "Setup required",
    description: "Complete your organization setup to access this feature.",
    ctaLabel: "Go to Setup",
  },
};

const defaultBlockedCopy: FeatureBlockedCopy = {
  title: "Feature unavailable",
  description: "This feature is not available on your current plan or configuration.",
  ctaLabel: "Learn More",
};

function resolveBlockedCopy(
  feature: ResolvedFeature,
  override?: Partial<FeatureBlockedCopy>,
): FeatureBlockedCopy {
  const collector = feature.blockedBy[0]?.split(":")[0];
  const base =
    (collector !== undefined ? blockedCopyByCollector[collector] : undefined) ?? defaultBlockedCopy;
  return {
    title: override?.title ?? base.title,
    description: override?.description ?? base.description,
    ctaLabel: override?.ctaLabel ?? base.ctaLabel,
  };
}

export type FeaturePageGuardProps = {
  /** Feature to guard on; omitted → nearest ambient scope. */
  featureId?: string;
  /** Rendered when the feature is hidden (default: the 404 page — don't advertise it). */
  whenHidden?: ReactNode;
  /** Overrides the reason-derived copy on the blocked screen. */
  copy?: Partial<FeatureBlockedCopy>;
  /** CTA handler on the blocked screen (navigate to plans/setup). Without it, no CTA renders. */
  onCta?: () => void;
  children: ReactNode;
};

/**
 * Route-level feature gate:
 *
 * - `ready`   → renders children
 * - `hidden`  → renders `whenHidden` (default 404 — hidden means "don't advertise")
 * - `blocked` → renders an upgrade/setup screen with copy derived from the
 *   blocking collector (`plan:` / `limit:` / `setup:`)
 *
 * Wrap the content of a route whose feature node carries gating keys.
 */
export function FeaturePageGuard({
  featureId,
  whenHidden = <NotFound />,
  copy,
  onCta,
  children,
}: FeaturePageGuardProps) {
  const feature = useFeature(featureId);

  if (feature.status === "hidden") {
    return <>{whenHidden}</>;
  }

  if (feature.status === "blocked") {
    const resolved = resolveBlockedCopy(feature, copy);
    return (
      <PageContainer featureId={feature.id} title={feature.label} state={{ kind: "ready" }}>
        <ErrorState
          icon={<Zap />}
          title={resolved.title}
          description={resolved.description}
          action={
            onCta ? (
              <ButtonGroup>
                <Button onClick={onCta}>{resolved.ctaLabel}</Button>
              </ButtonGroup>
            ) : undefined
          }
        />
      </PageContainer>
    );
  }

  return <>{children}</>;
}
