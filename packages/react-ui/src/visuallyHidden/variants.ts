import { cva } from "class-variance-authority";

/** Hides content visually while keeping it available to assistive technology. */
export const visuallyHiddenVariants = cva("sr-only");
