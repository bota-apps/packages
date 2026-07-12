import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CardEl, IconBadgeEl, Div, H, P, type IconBadgeTone } from "../html";
import { cn } from "../lib/utils";
import { featureTileHeaderVariants, featureTileVariants } from "./variants";

export * from "./variants";

export type FeatureTileProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Tint of the icon tile. */
  tone?: IconBadgeTone;
  /** Extra body content under the description (e.g. a checklist). */
  children?: ReactNode;
  /** Footer row under the body (e.g. a link or action). */
  footer?: ReactNode;
  className?: string;
};

/**
 * FeatureTile — the sanctioned marketing feature-card composition: a tinted
 * icon tile stacked above the title, supporting copy below, on a card
 * surface. Layout is container-scoped: below 16rem of its own width the
 * header collapses to an inline icon + title row so narrow columns degrade
 * gracefully.
 */
export function FeatureTile({
  icon: Icon,
  title,
  description,
  tone,
  children,
  footer,
  className,
}: FeatureTileProps) {
  return (
    <Div className={cn(featureTileVariants(), className)}>
      <CardEl fill>
        <Div className={featureTileHeaderVariants()}>
          <IconBadgeEl size="md" tone={tone}>
            <Icon />
          </IconBadgeEl>
          <H as="h3" variant="h5" className="min-w-0">
            {title}
          </H>
        </Div>
        {description && (
          <P variant="muted" className="mt-2">
            {description}
          </P>
        )}
        {children && <Div className="mt-4">{children}</Div>}
        {footer && (
          <Div layout="row" className="mt-4">
            {footer}
          </Div>
        )}
      </CardEl>
    </Div>
  );
}
