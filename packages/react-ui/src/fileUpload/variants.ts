import { cva, type VariantProps } from "class-variance-authority";
import { focusRingClasses } from "../html/interaction";

/**
 * Root wrapper around the trigger, the hidden input, and the optional
 * selection preview. Carries the module's `@container` scope — descendants
 * (dropzone padding, preview grid) adapt to this element's width, never the
 * viewport. The wrapper itself must stay free of `@…:` variants.
 */
export const fileUploadRootVariants = cva("@container flex w-full flex-col gap-3", {
  variants: {
    /** `button` keeps the compact trigger at its content width. */
    trigger: {
      dropzone: "",
      button: "items-start",
    },
  },
  defaultVariants: { trigger: "dropzone" },
});

export type FileUploadRootVariantProps = VariantProps<typeof fileUploadRootVariants>;

/**
 * Dropzone drop target. Every state pairs a non-color cue with the color
 * shift so no state is color-only:
 *   - drag-over: dashed border becomes solid (plus `ring` border + `muted` fill)
 *   - disabled/busy: reduced opacity + `not-allowed`/`progress` cursor
 * Padding is container-responsive: compact in narrow cards, airy when the
 * container passes the `@md` width.
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
        sm: "px-3 py-4 @md:px-4 @md:py-5",
        default: "px-4 py-6 @md:px-6 @md:py-10",
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

/** Icon slot above the dropzone label; grows with the container. */
export const fileUploadIconVariants = cva(
  "mb-2 flex justify-center text-muted-foreground [&_svg]:size-6 @md:mb-3 @md:[&_svg]:size-8",
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

/**
 * Selection preview root — its own `@container` scope so the list also
 * adapts when the preview is composed standalone, away from the trigger.
 */
export const fileUploadPreviewVariants = cva("@container flex w-full flex-col gap-2");

/** Preview rows: single column, two columns once the container passes `@2xl`. */
export const fileUploadPreviewListVariants = cva(
  "grid list-none grid-cols-1 gap-2 @2xl:grid-cols-2",
);

/** One selected-file row. `min-w-0` lets the name column truncate. */
export const fileUploadPreviewItemVariants = cva(
  "flex min-w-0 items-center gap-3 rounded-md border border-input bg-background p-2",
);

/** Image thumbnail (and its pre-load placeholder) in a preview row. */
export const fileUploadPreviewThumbVariants = cva(
  "size-9 shrink-0 rounded-md border border-input bg-muted object-cover",
);

/** Name + size column; flexes and truncates instead of breaking the row. */
export const fileUploadPreviewMetaVariants = cva("min-w-0 flex-1");

/** File name line — truncates with the full name in `title`. */
export const fileUploadPreviewNameVariants = cva(
  "block truncate text-sm font-medium text-foreground",
);

/** Human-readable size line under the name. */
export const fileUploadPreviewSizeVariants = cva("block text-xs text-muted-foreground");

/** Footer holding the clear-all action, aligned to the row edge. */
export const fileUploadPreviewFooterVariants = cva("flex justify-end");
