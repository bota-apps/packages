import type { ReactNode } from "react";
import { SectionEl, Div, H, P, Span } from "../html";

export * from "./variants";

type SectionBackground = "default" | "muted" | "primary";

type SectionProps = {
  background?: SectionBackground;
  children: ReactNode;
  className?: string;
};

export function Section({ background = "default", children, className }: SectionProps) {
  return (
    <SectionEl variant="marketing" background={background} className={className}>
      <Div className="container mx-auto px-4">{children}</Div>
    </SectionEl>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionTitle({ title, description }: SectionHeaderProps) {
  return (
    <Div className="max-w-3xl mx-auto text-center mb-12">
      <H as="h2" variant="h2" className="mb-4">
        {title}
      </H>
      {description && <P className="text-lg opacity-90">{description}</P>}
    </Div>
  );
}

type StepIndicatorProps = {
  step: string;
  title: string;
  description: string;
};

export function StepIndicator({ step, title, description }: StepIndicatorProps) {
  return (
    <Div layout="colCenter" className="text-center">
      <Span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
        {step}
      </Span>
      <H as="h3" variant="h5" className="mb-2">
        {title}
      </H>
      <P variant="muted">{description}</P>
    </Div>
  );
}

type CheckItemProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function CheckItem({ icon, children }: CheckItemProps) {
  return (
    <Div layout="row" gap="sm" className="text-sm">
      <Div className="[&>svg]:h-4 [&>svg]:w-4">{icon}</Div>
      <Span>{children}</Span>
    </Div>
  );
}
