import { cva } from "class-variance-authority";

export const calendarVariants = cva("p-3");

/** Default Tailwind classNames applied to react-day-picker's slots. */
export const calendarClassNames = {
  root: "relative",
  months: "flex flex-col sm:flex-row gap-4",
  month: "flex flex-col gap-4",
  month_caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
  caption_label: "text-sm font-medium",
  nav: "flex items-center gap-1 absolute top-3 right-3 left-3 justify-between z-10",
  button_previous:
    "inline-flex items-center justify-center rounded-md border border-input h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer",
  button_next:
    "inline-flex items-center justify-center rounded-md border border-input h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
  week: "flex w-full mt-2",
  day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].range_end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
  day_button:
    "inline-flex items-center justify-center rounded-md h-8 w-8 p-0 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-selected:opacity-100 cursor-pointer",
  range_start: "rounded-l-md",
  range_end: "rounded-r-md",
  selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
  today: "bg-accent text-accent-foreground rounded-md",
  outside:
    "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
  disabled: "text-muted-foreground opacity-50",
  range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
  hidden: "invisible",
};
