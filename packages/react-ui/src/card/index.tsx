import type { ReactNode } from "react";
import { CardEl, CardIconEl, CardHeaderEl, CardTitleGroupEl, type CardElProps } from "../html";
import { Div, H, P } from "../html";

type CardProps = Omit<CardElProps, "title"> & {
  title?: string;
  description?: string;
  icon?: ReactNode;
  headerRight?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

function Card({
  variant,
  fill,
  title,
  description,
  icon,
  headerRight,
  children,
  footer,
  className,
}: CardProps) {
  const hasHeader = Boolean(title || headerRight);

  return (
    <CardEl variant={variant} fill={fill} className={className}>
      {variant === "feature" && (
        <Div padding="lg">
          {icon && <CardIconEl>{icon}</CardIconEl>}
          {title && (
            <H as="h3" variant="h5" mb="2">
              {title}
            </H>
          )}
          {description && <P variant="muted">{description}</P>}
        </Div>
      )}

      {variant !== "feature" && hasHeader && (
        <CardHeaderEl spacing={variant === "interactive" ? "compact" : "default"}>
          <CardTitleGroupEl>
            {title && (
              <H as="h3" variant={variant === "interactive" ? "interactiveCardTitle" : "cardTitle"}>
                {title}
              </H>
            )}
            {description && <P variant="muted">{description}</P>}
          </CardTitleGroupEl>
          {headerRight && <Div>{headerRight}</Div>}
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
