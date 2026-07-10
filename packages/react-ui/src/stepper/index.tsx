/**
 * Stepper — horizontal step indicator with per-segment colored connector lines.
 *
 * Each step takes equal width (flex-1) and renders:
 *   [left-line] [bubble] [right-line]
 * with labels below. First step omits left line, last omits right line.
 * Line segments are colored to match each step's bubble state.
 *
 * The root is a container-query scope: below the @2xl container width the
 * per-step labels hide and a compact "Step x of n — label" summary renders
 * instead, so the stepper adapts to its panel, not the viewport.
 */
import type { ReactNode } from "react";
import { StepBubbleEl, type StepBubbleState } from "../html/badge";
import { Text } from "../html/typography";
import { Stack } from "../html/layout";
import { cn } from "../lib/utils";
import { stepperLineVariants, stepperVariants } from "./variants";

export * from "./variants";

export type StepperStep = {
  key: string;
  state: StepBubbleState;
  content: ReactNode;
  label: string;
  description?: string;
  /** Numeric weight for proportional bubble sizing. */
  weight?: number;
};

type StepperSize = "default" | "lg" | "xl";

export type StepperProps = {
  steps: StepperStep[];
  size?: StepperSize;
  onStepClick?: (key: string) => void;
  /** Constrain stepper width so it doesn't stretch full-width. */
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

export function Stepper({ steps, size = "default", onStepClick, maxWidth }: StepperProps) {
  const weights = steps.map((s) => s.weight ?? 0);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;
  const activeIndex = steps.findIndex((step) => step.state === "active");
  const activeStep = activeIndex === -1 ? undefined : steps[activeIndex];

  return (
    <div className={cn(stepperVariants({ maxWidth }))}>
      <div className="flex w-full">
        {steps.map((step, i) => {
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;
          const line = stepperLineVariants({ state: step.state });
          const scale =
            step.weight !== undefined ? 1 + ((step.weight - minW) / range) * 0.35 : undefined;

          const bubble = (
            <StepBubbleEl
              size={size}
              state={step.state}
              style={scale !== undefined ? { transform: `scale(${scale})` } : undefined}
            >
              {step.content}
            </StepBubbleEl>
          );

          const labelAlign = isFirst ? "start" : isLast ? "end" : "center";
          const textAlign = isFirst ? "left" : isLast ? "right" : "center";

          return (
            <Stack key={step.key} align={labelAlign} gap="md" className="flex-1 min-w-0">
              <div className="flex w-full items-center gap-3">
                {!isFirst && <div className={line} />}
                {onStepClick ? (
                  <button
                    type="button"
                    onClick={() => onStepClick(step.key)}
                    className="relative z-10 shrink-0 cursor-pointer rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {bubble}
                  </button>
                ) : (
                  <span className="relative z-10 shrink-0">{bubble}</span>
                )}
                {!isLast && <div className={line} />}
              </div>
              <Stack align={labelAlign} gap="xs" className="hidden @2xl:flex">
                <Text size="sm" weight="medium" align={textAlign}>
                  {step.label}
                </Text>
                {step.description !== undefined && (
                  <Text size="sm" tone="muted" align={textAlign}>
                    {step.description}
                  </Text>
                )}
              </Stack>
            </Stack>
          );
        })}
      </div>
      {activeStep !== undefined && (
        <Text size="sm" weight="medium" className="mt-2 @2xl:hidden">
          {`Step ${activeIndex + 1} of ${steps.length} — ${activeStep.label}`}
        </Text>
      )}
    </div>
  );
}
