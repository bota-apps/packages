/**
 * html/themeToggle — icon elements for the theme toggle button.
 * Used by the ThemeToggleIcon component.
 */
import { Moon, Sun } from "lucide-react";
import { cva } from "class-variance-authority";

export const themeToggleSunVariants = cva(
  "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
);

export const themeToggleMoonVariants = cva(
  "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
);

/** Sun icon — visible in light mode, rotates/scales to hidden in dark mode. */
export function SunIconEl() {
  return <Sun className={themeToggleSunVariants()} />;
}

/** Moon icon — hidden in light mode, rotates/scales into view in dark mode. */
export function MoonIconEl() {
  return <Moon className={themeToggleMoonVariants()} />;
}
