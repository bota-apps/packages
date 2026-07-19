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

/**
 * Row body (thumbnail + name + size) doubling as the lightbox trigger.
 * Negative margin lets the hover/focus surface bleed to the row padding
 * without moving the content.
 */
export const fileUploadPreviewTriggerVariants = cva([
  "-m-1 flex min-w-0 flex-1 cursor-zoom-in items-center gap-3 rounded-md p-1 text-left transition-colors",
  "hover:bg-muted",
  focusRingClasses,
]);

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

/**
 * Lightbox dialog panel — wider than the default dialog so documents get
 * room. The dialog is viewport-owned chrome (like the base modal), so its
 * sizing is the exception to container-scoped responsiveness.
 */
export const fileUploadLightboxContentVariants = cva("max-w-3xl");

/** Fixed-height centered stage the staged image/document fills. */
export const fileUploadLightboxStageVariants = cva(
  "flex h-[min(60dvh,36rem)] items-center justify-center overflow-hidden rounded-md border border-input bg-muted",
);

/** Staged image — letterboxed to fit, never cropped. */
export const fileUploadLightboxImageVariants = cva("max-h-full max-w-full object-contain");

/** Lightbox footer: remove action on one edge, pager on the other. */
export const fileUploadLightboxFooterVariants = cva("flex items-center justify-between gap-2");

/** Pager cluster (previous / position / next). */
export const fileUploadLightboxNavVariants = cva("ml-auto flex items-center gap-1");

/** "n of m" position readout between the pager buttons. */
export const fileUploadLightboxPositionVariants = cva(
  "min-w-14 text-center text-sm tabular-nums text-muted-foreground",
);
