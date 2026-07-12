import type { ReactNode } from "react";
import { Div, H, P } from "../html";
import { emptyStateVariants, emptyStateIconVariants, type EmptyStateVariant } from "./variants";

export * from "./variants";

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  /** Optional call-to-action rendered under the description. */
  action?: ReactNode;
  /** `tinted` places the icon inside a soft circular tint chip. */
  variant?: EmptyStateVariant;
};

export function EmptyState({ icon, title, description, action, variant }: EmptyStateProps) {
  return (
    <Div layout="colCenter" className={emptyStateVariants()}>
      {icon && <Div className={emptyStateIconVariants({ variant })}>{icon}</Div>}
      <H as="h3" variant="h5" className="mb-2">
        {title}
      </H>
      <P variant="muted" className="mb-6 max-w-md">
        {description}
      </P>
      {action}
    </Div>
  );
}
