import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { stackedBarVariants } from "./variants";

type StackedBarSegment = {
  key: string;
  value: number;
  color: string;
  label: string;
};

type StackedBarProps = {
  segments: StackedBarSegment[];
  height?: "sm" | "md" | "lg";
};

export function StackedBar({ segments, height = "md" }: StackedBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    return null;
  }

  const visibleSegments = segments.filter((s) => s.value > 0);

  return (
    <TooltipProvider delayDuration={0}>
      <div className={stackedBarVariants({ height })}>
        {visibleSegments.map((segment, i) => {
          const pct = (segment.value / total) * 100;
          const isFirst = i === 0;
          const isLast = i === visibleSegments.length - 1;
          const roundedClass =
            isFirst && isLast
              ? "rounded-full"
              : isFirst
                ? "rounded-l-full"
                : isLast
                  ? "rounded-r-full"
                  : "";

          return (
            <Tooltip key={segment.key}>
              <TooltipTrigger asChild>
                <span
                  className={`${segment.color} ${roundedClass} h-full transition-all duration-500 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                {segment.label}: {segment.value} ({Math.round(pct)}%)
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

export * from "./variants";
