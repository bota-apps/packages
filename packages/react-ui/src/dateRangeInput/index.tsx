import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { formatDateCompact } from "@bota-apps/utils/time";
import { dateRangeInputTriggerVariants } from "./variants";

type DateRangeInputProps = {
  startValue: string;
  endValue: string;
  onChange: (start: string, end: string) => void;
  placeholder?: string;
  width?: "full" | "auto";
};

function toDate(iso: string): Date | undefined {
  if (!iso) {
    return undefined;
  }
  const d = new Date(iso + "T00:00:00");
  return isNaN(d.getTime()) ? undefined : d;
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DateRangeInput({
  startValue,
  endValue,
  onChange,
  placeholder = "Pick date range",
  width = "full",
}: DateRangeInputProps) {
  const [open, setOpen] = useState(false);

  const from = toDate(startValue);
  const to = toDate(endValue);
  const selected: DateRange | undefined = from ? { from, to } : undefined;

  const handleSelect = (range: DateRange | undefined, _triggerDate: Date) => {
    onChange(range?.from ? toISO(range.from) : "", range?.to ? toISO(range.to) : "");
  };

  const hasRange = from && to;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            dateRangeInputTriggerVariants({ width }),
            !hasRange && "text-muted-foreground",
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 opacity-50" />
            {hasRange
              ? `${formatDateCompact(startValue)} – ${formatDateCompact(endValue)}`
              : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar mode="range" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}

export * from "./variants";
