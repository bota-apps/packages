import type { ReactNode } from "react";
import { Div, H, P } from "../html";
import { emptyStateVariants, emptyStateIconVariants } from "./variants";

export * from "./variants";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Div layout="colCenter" className={emptyStateVariants()}>
      {icon && <Div className={emptyStateIconVariants()}>{icon}</Div>}
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
