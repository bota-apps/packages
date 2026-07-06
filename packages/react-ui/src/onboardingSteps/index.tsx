import { CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Inline } from "../layout";
import { Text } from "../typography";
import { StepBubbleEl } from "../html";

export type OnboardingStepConfig = {
  key: string;
  label: string;
  icon: LucideIcon;
};

type OnboardingStepsProps = {
  steps: OnboardingStepConfig[];
  current: string;
};

export function OnboardingSteps({ steps, current }: OnboardingStepsProps) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
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
              >
                {step.label}
              </Text>
            </Inline>
            {i < steps.length - 1 && (
              <Text tone="muted" size="sm">
                —
              </Text>
            )}
          </Inline>
        );
      })}
    </Inline>
  );
}

export * from "./variants";
