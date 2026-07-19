import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "../button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../dialog";
import { FileFormatIcon, resolvePreviewKind } from "../documentPreview";
import { Div } from "../html/div";
import { Iframe } from "../html/iframe";
import { Img } from "../html/img";
import { Span } from "../html/span";
import { Stack } from "../html/layout";
import { Text } from "../html/typography";
import { fileKey, formatBytes } from "./shared";
import {
  fileUploadLightboxContentVariants,
  fileUploadLightboxFooterVariants,
  fileUploadLightboxImageVariants,
  fileUploadLightboxNavVariants,
  fileUploadLightboxPositionVariants,
  fileUploadLightboxStageVariants,
} from "./variants";

type FileUploadLightboxProps = {
  files: File[];
  /** Index of the file on stage; the caller owns it and keeps it in range. */
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onRemove: (file: File) => void;
  removeDisabled: boolean;
  removeLabel: (fileName: string) => string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  positionLabel: (position: number, total: number) => string;
  unavailableLabel: ReactNode;
};

/**
 * Image and PDF files embed via an object URL owned by the stage: created on
 * mount, revoked on unmount. The stage remounts per file (keyed by the
 * caller), so switching files never shows a stale or revoked URL.
 */
function LightboxStage({ file, unavailableLabel }: { file: File; unavailableLabel: ReactNode }) {
  const kind = resolvePreviewKind(file.type === "" ? undefined : file.type, file.name);
  const embeddable = kind === "image" || kind === "pdf";
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!embeddable) {
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, embeddable]);

  if (kind === "image" && objectUrl !== undefined) {
    return <Img src={objectUrl} alt={file.name} className={fileUploadLightboxImageVariants()} />;
  }
  if (kind === "pdf" && objectUrl !== undefined) {
    return <Iframe src={objectUrl} title={file.name} variant="preview" />;
  }
  if (embeddable) {
    // Object URL lands right after the first paint of this mount.
    return null;
  }
  return (
    <Stack gap="sm" align="center" className="p-6">
      <FileFormatIcon
        mimeType={file.type === "" ? undefined : file.type}
        url={file.name}
        size="lg"
      />
      <Text tone="muted" size="sm" align="center">
        {unavailableLabel}
      </Text>
    </Stack>
  );
}

/**
 * Full-size preview dialog for the selected-files list: one file on stage at
 * a time, previous/next paging (buttons and arrow keys) across the selection,
 * and a remove action for the staged file. Closing is Radix-native (Esc,
 * overlay, close button).
 */
export function FileUploadLightbox({
  files,
  index,
  onIndexChange,
  onClose,
  onRemove,
  removeDisabled,
  removeLabel,
  closeLabel,
  previousLabel,
  nextLabel,
  positionLabel,
  unavailableLabel,
}: FileUploadLightboxProps) {
  const file = files[index];
  const lastIndex = files.length - 1;

  // Paging listens at the document, not the dialog content: reaching an end
  // disables the focused pager button, which drops focus to the body — a
  // content-scoped keydown handler would go deaf right then. The dialog is
  // modal, so while it is open the arrows belong to it.
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        onIndexChange(index - 1);
      }
      if (event.key === "ArrowRight" && index < lastIndex) {
        event.preventDefault();
        onIndexChange(index + 1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, lastIndex, onIndexChange]);

  if (file === undefined) {
    return null;
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className={fileUploadLightboxContentVariants()} closeLabel={closeLabel}>
        <DialogHeader>
          <DialogTitle className="truncate pr-6" title={file.name}>
            {file.name}
          </DialogTitle>
          <DialogDescription>{formatBytes(file.size)}</DialogDescription>
        </DialogHeader>
        <Div className={fileUploadLightboxStageVariants()}>
          <LightboxStage key={fileKey(file)} file={file} unavailableLabel={unavailableLabel} />
        </Div>
        <Div className={fileUploadLightboxFooterVariants()}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={removeDisabled}
            aria-label={removeLabel(file.name)}
            onClick={() => onRemove(file)}
          >
            <Trash2 aria-hidden="true" />
          </Button>
          {files.length > 1 && (
            <Div className={fileUploadLightboxNavVariants()}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === 0}
                aria-label={previousLabel}
                onClick={() => onIndexChange(index - 1)}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Span className={fileUploadLightboxPositionVariants()}>
                {positionLabel(index + 1, files.length)}
              </Span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === lastIndex}
                aria-label={nextLabel}
                onClick={() => onIndexChange(index + 1)}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </Div>
          )}
        </Div>
      </DialogContent>
    </Dialog>
  );
}
