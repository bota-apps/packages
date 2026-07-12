import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CardEl,
  CardHeaderEl,
  CardTitleGroupEl,
  IconBadgeEl,
  type CardElProps,
  type IconBadgeTone,
} from "../html";
import { Div, H, P } from "../html";

type CardProps = Omit<CardElProps, "title"> & {
  title?: string;
  description?: string;
  /**
   * Leading icon tile in the header, aligned to the title block. The sole
   * sanctioned icon placement on a content card — icons never render in
   * `headerRight`.
   */
  icon?: LucideIcon;
  /** Tint of the leading icon tile. */
  iconTone?: IconBadgeTone;
  /** Trailing header slot for actions and badges — never icon tiles. */
  headerRight?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

function Card({
  variant,
  fill,
  title,
  description,
  icon: Icon,
  iconTone,
  headerRight,
  children,
  footer,
  className,
}: CardProps) {
  const hasHeader = Boolean(title || Icon || headerRight);

  return (
    <CardEl variant={variant} fill={fill} className={className}>
      {hasHeader && (
        <CardHeaderEl spacing={variant === "interactive" ? "compact" : "default"}>
          <Div layout="row" gap="md" grow>
            {Icon && (
              <IconBadgeEl size="md" tone={iconTone}>
                <Icon />
              </IconBadgeEl>
            )}
            <CardTitleGroupEl>
              {title && (
                <H
                  as="h3"
                  variant={variant === "interactive" ? "interactiveCardTitle" : "cardTitle"}
                >
                  {title}
                </H>
              )}
              {description && <P variant="muted">{description}</P>}
            </CardTitleGroupEl>
          </Div>
          {headerRight && <Div shrink="0">{headerRight}</Div>}
        </CardHeaderEl>
      )}

      {children}

      {footer && (
        <Div layout="row" pt="6">
          {footer}
        </Div>
      )}
    </CardEl>
  );
}

export type { CardProps };
export { Card };
export * from "./variants";
