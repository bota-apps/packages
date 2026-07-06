import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { calendarClassNames, calendarVariants } from "./variants";

function DefaultChevron({ orientation }: { orientation?: string }) {
  return orientation === "left" ? (
    <ChevronLeft className="h-4 w-4" />
  ) : (
    <ChevronRight className="h-4 w-4" />
  );
}

function Calendar({ className, classNames, ...props }: DayPickerProps) {
  return (
    <DayPicker
      className={cn(calendarVariants(), className)}
      classNames={{ ...calendarClassNames, ...classNames }}
      components={{ Chevron: DefaultChevron }}
      {...props}
    />
  );
}

export { Calendar };
export type { DayPickerProps as CalendarProps };
export * from "./variants";
