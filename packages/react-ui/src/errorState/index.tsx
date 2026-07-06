import { type ReactNode } from "react";
import { Div, H, P } from "../html";
import { errorStateVariants, errorStateIconVariants } from "./variants";

export * from "./variants";

type ErrorStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function ErrorState({ icon, title, description, action }: ErrorStateProps) {
  return (
    <Div layout="colCenter" className={errorStateVariants()}>
      {icon && <Div className={errorStateIconVariants()}>{icon}</Div>}
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
