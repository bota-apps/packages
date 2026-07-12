import { cva } from "class-variance-authority";

/**
 * AnimatedNumber host — an inline box sized by the *final* value so the
 * count-up never causes layout shift as digits accumulate. Tabular figures
 * keep the digits from wobbling horizontally while they tick.
 */
export const animatedNumberVariants = cva("relative inline-block tabular-nums");

/** Invisible copy of the final value that reserves the resting width. */
export const animatedNumberSizerVariants = cva("invisible");

/** The ticking value, painted over the reserved box. */
export const animatedNumberValueVariants = cva("absolute inset-0");
