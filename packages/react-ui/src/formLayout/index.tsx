import type { ReactNode } from "react";
import { Div } from "../html";
import { formGridVariants } from "./variants";

export * from "./variants";

type FormFieldProps = {
  children: ReactNode;
};

export function FormField({ children }: FormFieldProps) {
  return (
    <Div gap="sm" className="space-y-2">
      {children}
    </Div>
  );
}

type FormGridProps = {
  children: ReactNode;
  columns?: 2 | 3;
  gap?: "md" | "lg";
};

export function FormGrid({ children, columns = 2, gap = "md" }: FormGridProps) {
  return (
    <Div className="@container">
      <Div layout="grid" gap={gap} className={formGridVariants({ columns })}>
        {children}
      </Div>
    </Div>
  );
}

type ButtonGroupProps = {
  children: ReactNode;
};

export function ButtonGroup({ children }: ButtonGroupProps) {
  return (
    <Div layout="row" gap="md">
      {children}
    </Div>
  );
}
