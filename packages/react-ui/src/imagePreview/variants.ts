import { cva, type VariantProps } from "class-variance-authority";
import { focusRingClasses } from "../html/interaction";

/**
 * Thumbnail trigger opening the full-size preview. `cursor-zoom-in` signals
 * the in-place preview (matching the file-upload preview rows) — this is not
 * a navigation link.
 */
export const imagePreviewTriggerVariants = cva(
  [
    "block shrink-0 cursor-zoom-in overflow-hidden rounded-md border border-input transition-opacity hover:opacity-90",
    focusRingClasses,
  ],
  {
    variants: {
      size: {
        sm: "size-16",
        default: "size-24",
        lg: "size-32",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type ImagePreviewTriggerVariantProps = VariantProps<typeof imagePreviewTriggerVariants>;
export type ImagePreviewThumbnailSize = NonNullable<ImagePreviewTriggerVariantProps["size"]>;

/** Thumbnail image — fills the trigger, cropped to cover. */
export const imagePreviewThumbnailVariants = cva("h-full w-full object-cover");

/**
 * Preview dialog panel — wider than the default dialog so the image gets
 * room. Dialog chrome is viewport-owned, the exception to container-scoped
 * responsiveness.
 */
export const imagePreviewContentVariants = cva("max-w-3xl");
