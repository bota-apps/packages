import { cva } from "class-variance-authority";

/** Centered container for the error-state message block. */
export const errorStateVariants = cva("py-10 px-4 text-center");

/** Destructive-toned icon slot above the title. */
export const errorStateIconVariants = cva("text-destructive mb-4");
