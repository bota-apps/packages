import { cva } from "class-variance-authority";

/** One crumb (label + separator) — kept on a single line inside the trail. */
export const breadcrumbItemVariants = cva("whitespace-nowrap");
