import { cva } from "class-variance-authority";

/** Reserved height for loading/error/empty states so the chrome doesn't jump between states. */
export const pageStateContentVariants = cva("min-h-[320px]");
