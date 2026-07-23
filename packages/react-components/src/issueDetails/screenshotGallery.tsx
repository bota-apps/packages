import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import {
  Carousel,
  carouselImageVariants,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ImagePreview,
  imagePreviewContentVariants,
  imagePreviewThumbnailVariants,
  imagePreviewTriggerVariants,
  Img,
  Inline,
} from "@bota-apps/react-ui";
import type { IssueScreenshotRef } from "../issueReporter/types";

type ScreenshotGalleryProps = {
  screenshots: readonly IssueScreenshotRef[];
  previewLabel: (fileName: string) => string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  positionLabel: (position: number, total: number) => string;
};

/**
 * Screenshot thumbnails with an in-app full-size preview: a lone previewable
 * screenshot opens an `ImagePreview` dialog; two or more share one dialog
 * staging a `Carousel`, opened at the clicked screenshot. Screenshots whose
 * bytes are not available yet stay file-name chips.
 */
export function ScreenshotGallery({
  screenshots,
  previewLabel,
  closeLabel,
  previousLabel,
  nextLabel,
  positionLabel,
}: ScreenshotGalleryProps) {
  const previewable = screenshots.filter(
    (screenshot): screenshot is IssueScreenshotRef & { url: string } =>
      screenshot.url !== undefined,
  );
  // Index into `previewable` of the screenshot on stage; undefined = closed.
  const [lightboxIndex, setLightboxIndex] = useState<number | undefined>(undefined);
  const stagedIndex =
    lightboxIndex === undefined
      ? undefined
      : Math.min(lightboxIndex, Math.max(previewable.length - 1, 0));
  const staged = stagedIndex === undefined ? undefined : previewable[stagedIndex];

  return (
    <>
      <Inline gap="sm" align="start" wrap>
        {screenshots.map((screenshot) => {
          if (screenshot.url === undefined) {
            return (
              <span
                key={screenshot.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-sm text-muted-foreground"
              >
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {screenshot.fileName}
              </span>
            );
          }
          if (previewable.length === 1) {
            return (
              <ImagePreview
                key={screenshot.id}
                src={screenshot.url}
                alt={screenshot.fileName}
                previewLabel={previewLabel(screenshot.fileName)}
                closeLabel={closeLabel}
              />
            );
          }
          const position = previewable.findIndex((candidate) => candidate.id === screenshot.id);
          return (
            <button
              key={screenshot.id}
              type="button"
              className={imagePreviewTriggerVariants()}
              aria-haspopup="dialog"
              aria-label={previewLabel(screenshot.fileName)}
              onClick={() => setLightboxIndex(position)}
            >
              {/* The trigger's aria-label already names the screenshot. */}
              <Img src={screenshot.url} alt="" className={imagePreviewThumbnailVariants()} />
            </button>
          );
        })}
      </Inline>
      {staged !== undefined && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setLightboxIndex(undefined);
            }
          }}
        >
          <DialogContent
            className={imagePreviewContentVariants()}
            closeLabel={closeLabel}
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle className="truncate pr-6" title={staged.fileName}>
                {staged.fileName}
              </DialogTitle>
            </DialogHeader>
            <Carousel
              index={stagedIndex}
              onIndexChange={setLightboxIndex}
              arrowKeys="document"
              previousLabel={previousLabel}
              nextLabel={nextLabel}
              positionLabel={positionLabel}
            >
              {previewable.map((screenshot) => (
                <Img
                  key={screenshot.id}
                  src={screenshot.url}
                  alt={screenshot.fileName}
                  className={carouselImageVariants()}
                />
              ))}
            </Carousel>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
