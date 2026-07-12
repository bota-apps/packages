import { CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Div, StepBubbleEl } from "../html";
import { Inline } from "../layout";
import { Text } from "../typography";

export type OnboardingStepConfig = {
  key: string;
  label: string;
  icon: LucideIcon;
};

type OnboardingStepsProps = {
  steps: OnboardingStepConfig[];
  current: string;
};

/**
 * Container-scoped: in narrow containers only the active step keeps its label
 * (the rest collapse to bubbles), so the strip fits a phone-width panel. The
 * component renders its own `@container` wrapper.
 */
export function OnboardingSteps({ steps, current }: OnboardingStepsProps) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <Div className="@container">
      <Inline gap="sm" justify="center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = step.key === current;
          const isDone = i < currentIndex;
          const state = isActive ? "active" : isDone ? "done" : "upcoming";

          return (
            <Inline key={step.key} gap="sm">
              <Inline gap="xs">
                <StepBubbleEl state={state}>{isDone ? <CheckCircle /> : <Icon />}</StepBubbleEl>
                <Text
                  size="sm"
                  weight={isActive ? "semibold" : "normal"}
                  tone={isActive ? "default" : "muted"}
                  className={isActive ? undefined : "hidden @2xl:block"}
                >
                  {step.label}
                </Text>
              </Inline>
              {i < steps.length - 1 && (
                <Text tone="muted" size="sm" className="hidden @2xl:block">
                  —
                </Text>
              )}
            </Inline>
          );
        })}
      </Inline>
    </Div>
  );
}

export * from "./variants";
