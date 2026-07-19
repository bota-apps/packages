import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "../button";
import { FileFormatIcon } from "../documentPreview";
import { Div } from "../html/div";
import { Img } from "../html/img";
import { Span } from "../html/span";
import { Li, Ul } from "../html/ul";
import { FileUploadLightbox } from "./lightbox";
import { fileKey, formatBytes } from "./shared";
import {
  fileUploadPreviewFooterVariants,
  fileUploadPreviewItemVariants,
  fileUploadPreviewListVariants,
  fileUploadPreviewMetaVariants,
  fileUploadPreviewNameVariants,
  fileUploadPreviewSizeVariants,
  fileUploadPreviewThumbVariants,
  fileUploadPreviewTriggerVariants,
  fileUploadPreviewVariants,
} from "./variants";

export type FileUploadPreviewProps = {
  /** The selected files, in display order. The caller owns this list. */
  files: File[];
  /** Receives the file whose remove button was activated. */
  onRemove: (file: File) => void;
  /** When set, a clear-all action shows while more than one file is listed. */
  onClearAll?: () => void;
  /** Suspends the remove/clear actions (e.g. while an upload is running). */
  disabled?: boolean;
  /** Accessible name of the file list. Default "Selected files". */
  listLabel?: string;
  /** Builds the accessible name of a row's remove button. Default `Remove ${fileName}`. */
  removeLabel?: (fileName: string) => string;
  /** Clear-all action label. Default "Clear all". */
  clearAllLabel?: ReactNode;
  /** Builds the accessible name of a row's open-preview trigger. Default `Preview ${fileName}`. */
  previewLabel?: (fileName: string) => string;
  /** Accessible name of the lightbox close button. Default "Close". */
  closeLabel?: string;
  /** Accessible name of the lightbox previous-file button. Default "Previous file". */
  previousLabel?: string;
  /** Accessible name of the lightbox next-file button. Default "Next file". */
  nextLabel?: string;
  /** Builds the lightbox "n of m" position readout. Default `${position} of ${total}`. */
  positionLabel?: (position: number, total: number) => string;
  /** Lightbox fallback for formats with no inline preview. Default "Preview not available". */
  previewUnavailableLabel?: ReactNode;
};

/**
 * Image files get a real thumbnail via an object URL owned by this component:
 * created when the row mounts, revoked when the row unmounts or the file
 * changes. Everything else falls back to the shared format icon.
 */
function PreviewThumb({ file }: { file: File }) {
  const imageFile = file.type.toLowerCase().startsWith("image/");
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, imageFile]);

  if (!imageFile) {
    return <FileFormatIcon mimeType={file.type === "" ? undefined : file.type} url={file.name} />;
  }
  if (objectUrl === undefined) {
    return <Span aria-hidden="true" className={fileUploadPreviewThumbVariants()} />;
  }
  return <Img src={objectUrl} alt="" className={fileUploadPreviewThumbVariants()} />;
}

/**
 * Pre-upload confirmation list for `FileUpload`'s controlled mode, also
 * usable standalone when an app lays out the trigger and the list apart.
 * Rows show a thumbnail (images) or format icon, the name, and a
 * human-readable size; each row is removable, and a clear-all action appears
 * for multi-file selections. Activating a row opens a full-size lightbox
 * that pages through the whole selection.
 */
export function FileUploadPreview({
  files,
  onRemove,
  onClearAll,
  disabled = false,
  listLabel = "Selected files",
  removeLabel = (fileName: string) => `Remove ${fileName}`,
  clearAllLabel = "Clear all",
  previewLabel = (fileName: string) => `Preview ${fileName}`,
  closeLabel = "Close",
  previousLabel = "Previous file",
  nextLabel = "Next file",
  positionLabel = (position: number, total: number) => `${position} of ${total}`,
  previewUnavailableLabel = "Preview not available",
}: FileUploadPreviewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Removing the staged file shifts the next one onto the stage; removing the
  // last file (or clearing) leaves nothing to stage, so the lightbox closes.
  const stagedIndex = lightboxIndex === null ? null : Math.min(lightboxIndex, files.length - 1);

  useEffect(() => {
    if (lightboxIndex !== null && files.length === 0) {
      setLightboxIndex(null);
    }
  }, [lightboxIndex, files.length]);

  if (files.length === 0) {
    return null;
  }
  return (
    <Div className={fileUploadPreviewVariants()}>
      <Ul aria-label={listLabel} className={fileUploadPreviewListVariants()}>
        {files.map((file, index) => (
          <Li key={fileKey(file)} className={fileUploadPreviewItemVariants()}>
            <button
              type="button"
              className={fileUploadPreviewTriggerVariants()}
              aria-label={previewLabel(file.name)}
              aria-haspopup="dialog"
              onClick={() => setLightboxIndex(index)}
            >
              <PreviewThumb file={file} />
              <Div className={fileUploadPreviewMetaVariants()}>
                <Span className={fileUploadPreviewNameVariants()} title={file.name}>
                  {file.name}
                </Span>
                <Span className={fileUploadPreviewSizeVariants()}>{formatBytes(file.size)}</Span>
              </Div>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              disabled={disabled}
              aria-label={removeLabel(file.name)}
              onClick={() => onRemove(file)}
            >
              <X aria-hidden="true" />
            </Button>
          </Li>
        ))}
      </Ul>
      {onClearAll !== undefined && files.length > 1 && (
        <Div className={fileUploadPreviewFooterVariants()}>
          <Button type="button" variant="action" size="sm" disabled={disabled} onClick={onClearAll}>
            {clearAllLabel}
          </Button>
        </Div>
      )}
      {stagedIndex !== null && stagedIndex >= 0 && (
        <FileUploadLightbox
          files={files}
          index={stagedIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onRemove={onRemove}
          removeDisabled={disabled}
          removeLabel={removeLabel}
          closeLabel={closeLabel}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          positionLabel={positionLabel}
          unavailableLabel={previewUnavailableLabel}
        />
      )}
    </Div>
  );
}
