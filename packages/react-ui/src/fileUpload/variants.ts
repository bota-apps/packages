import { cva, type VariantProps } from "class-variance-authority";
import { focusRingClasses } from "../html/interaction";

/**
 * Dropzone drop target. Every state pairs a non-color cue with the color
 * shift so no state is color-only:
 *   - drag-over: dashed border becomes solid (plus `ring` border + `muted` fill)
 *   - disabled/busy: reduced opacity + `not-allowed`/`progress` cursor
 */
export const fileUploadDropzoneVariants = cva(
  [
    "block w-full cursor-pointer rounded-lg border-2 border-dashed border-input bg-background text-center transition-colors",
    "hover:border-ring/40 hover:bg-muted",
    focusRingClasses,
  ],
  {
    variants: {
      size: {
        sm: "px-4 py-5",
        default: "px-6 py-10",
      },
      dragOver: {
        true: "border-solid border-ring bg-muted",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 hover:border-input hover:bg-background",
        false: "",
      },
      busy: {
        true: "cursor-progress hover:border-input hover:bg-background",
        false: "",
      },
    },
    defaultVariants: { size: "default", dragOver: false, disabled: false, busy: false },
  },
);

export type FileUploadDropzoneVariantProps = VariantProps<typeof fileUploadDropzoneVariants>;
export type FileUploadSize = NonNullable<FileUploadDropzoneVariantProps["size"]>;

/** Icon slot above the dropzone label. */
export const fileUploadIconVariants = cva(
  "mb-3 flex justify-center text-muted-foreground [&_svg]:size-8",
);

/** Primary label line inside the dropzone. */
export const fileUploadLabelVariants = cva("block text-sm font-medium text-foreground");

/** Secondary hint line (accepted formats, size limit) inside the dropzone. */
export const fileUploadDescriptionVariants = cva("mt-1 block text-xs text-muted-foreground");

/**
 * The real `<input type="file">` stays in the accessibility tree's shadow:
 * visually hidden, removed from the tab order, and driven by the visible
 * trigger. `sr-only` (not `display: none`) keeps `.click()` reliable
 * everywhere.
 */
export const fileUploadInputVariants = cva("sr-only");
