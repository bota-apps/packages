import type { ReactNode } from "react";
import { Div, SectionEl } from "@bota-apps/react-ui";
import {
  operationalDashboardVariants,
  type OperationalDashboardGap,
  type OperationalDashboardRatio,
} from "./variants";

export * from "./variants";

export type OperationalDashboardProps = {
  /** Main column content (charts, tables, primary panels). */
  primary: ReactNode;
  /** Optional side column (readiness, actions, secondary panels). */
  secondary?: ReactNode;
  /** Column proportion at wide container widths. Default "balanced". */
  ratio?: OperationalDashboardRatio;
  /** Spacing between the columns. Default "lg". */
  gap?: OperationalDashboardGap;
  /** Accessible name for the dashboard region. */
  ariaLabel?: string;
};

/**
 * Pure layout composition for an operational dashboard: a primary column with an
 * optional secondary column. One column in narrow containers, two in wide ones
 * (proportion set by `ratio`); when `secondary` is omitted, `primary` spans the
 * full width. This owns layout only — loading, error, and empty states stay the
 * caller's concern (compose it inside PageContainer's `ready` body).
 */
export function OperationalDashboard({
  primary,
  secondary,
  ratio = "balanced",
  gap = "lg",
  ariaLabel = "Dashboard",
}: OperationalDashboardProps) {
  const hasSecondary = secondary !== undefined;

  return (
    <Div className="@container">
      <SectionEl aria-label={ariaLabel} className={operationalDashboardVariants({ ratio, gap })}>
        {/* With no secondary column the primary fills every track, so a wide
            container renders it full-width instead of leaving an empty slot. */}
        <Div className={hasSecondary ? undefined : "col-span-full"}>{primary}</Div>
        {hasSecondary ? <Div>{secondary}</Div> : undefined}
      </SectionEl>
    </Div>
  );
}
