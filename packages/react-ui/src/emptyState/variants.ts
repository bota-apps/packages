import { cva } from "class-variance-authority";

/** Centered container for the empty-state message block. */
export const emptyStateVariants = cva("py-10 px-4 text-center");

/** Muted icon slot above the title. */
export const emptyStateIconVariants = cva("text-muted-foreground mb-4");
