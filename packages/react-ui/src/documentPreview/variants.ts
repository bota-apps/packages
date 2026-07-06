import { cva } from "class-variance-authority";

/** Tinted square icon badge indicating a file's format. */
export const fileFormatIconVariants = cva(
  "inline-flex items-center justify-center rounded-md [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-7 w-7 [&_svg]:size-4",
        md: "h-9 w-9 [&_svg]:size-[18px]",
        lg: "h-11 w-11 [&_svg]:size-5",
      },
      format: {
        pdf: "bg-red-500/10 text-red-500 dark:text-red-400",
        image: "bg-purple-500/10 text-purple-500 dark:text-purple-400",
        word: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
        spreadsheet: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
        presentation: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
        archive: "bg-slate-500/10 text-slate-500 dark:text-slate-400",
        unknown: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      format: "unknown",
    },
  },
);
