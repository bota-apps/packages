import { carouselImageVariants, carouselStageVariants } from "../carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Div } from "../html/div";
import { Img } from "../html/img";
import {
  imagePreviewContentVariants,
  imagePreviewThumbnailVariants,
  imagePreviewTriggerVariants,
  type ImagePreviewThumbnailSize,
} from "./variants";

export type ImagePreviewProps = {
  src: string;
  /** Describes the image; also the default dialog title and trigger label. */
  alt: string;
  /** Dialog heading. Defaults to `alt`. */
  title?: string;
  /** Accessible label for the thumbnail trigger. Override for non-English apps. */
  previewLabel?: string;
  /** Accessible label for the dialog close button. Override for non-English apps. */
  closeLabel?: string;
  thumbnailSize?: ImagePreviewThumbnailSize;
};

/**
 * A single image shown as a thumbnail that opens an in-app full-size preview
 * dialog — instead of navigating (or opening a tab) to the image URL. For
 * paging through several images, stage a `Carousel` in the dialog instead.
 */
export function ImagePreview({
  src,
  alt,
  title,
  previewLabel,
  closeLabel,
  thumbnailSize,
}: ImagePreviewProps) {
  const heading = title ?? alt;

  return (
    <Dialog>
      <DialogTrigger
        className={imagePreviewTriggerVariants({ size: thumbnailSize })}
        aria-label={previewLabel ?? `Preview ${alt}`}
      >
        {/* The trigger's aria-label already names the image. */}
        <Img src={src} alt="" className={imagePreviewThumbnailVariants()} />
      </DialogTrigger>
      <DialogContent
        className={imagePreviewContentVariants()}
        closeLabel={closeLabel}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="truncate pr-6" title={heading}>
            {heading}
          </DialogTitle>
        </DialogHeader>
        <Div className={carouselStageVariants()}>
          <Img src={src} alt={alt} className={carouselImageVariants()} />
        </Div>
      </DialogContent>
    </Dialog>
  );
}

export * from "./variants";
