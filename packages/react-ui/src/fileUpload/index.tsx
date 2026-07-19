import { useId, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "../button";
import { Div } from "../html/div";
import { SpinnerEl } from "../html";
import { FileUploadPreview } from "./preview";
import { fileKey, formatBytes } from "./shared";
import {
  fileUploadDescriptionVariants,
  fileUploadDropzoneVariants,
  fileUploadIconVariants,
  fileUploadInputVariants,
  fileUploadLabelVariants,
  fileUploadRootVariants,
  type FileUploadSize,
} from "./variants";

export * from "./variants";
export { FileUploadPreview, type FileUploadPreviewProps } from "./preview";

export type FileUploadRejection = {
  file: File;
  reason: "size" | "type";
};

export type FileUploadVariant = "dropzone" | "button";

type FileUploadCommonProps = {
  /** Native `accept` filter (extensions and/or MIME types, comma-separated). */
  accept?: string;
  /** Allow selecting more than one file. Default `false`. */
  multiple?: boolean;
  disabled?: boolean;
  /** Files larger than this are rejected with reason `"size"`. */
  maxSizeBytes?: number;
  /** Receives the files that failed `accept`/`maxSizeBytes` validation. */
  onInvalidFiles?: (rejections: FileUploadRejection[]) => void;
  /** Trigger label. Defaults to "Upload a file" ("Upload files" when `multiple`). */
  label?: ReactNode;
  /**
   * Secondary hint under the label (dropzone variant only). Defaults to a
   * summary derived from `accept`/`maxSizeBytes` when either is set.
   */
  description?: ReactNode;
  /** Shows a progress affordance and suspends the input. */
  busy?: boolean;
  /** `dropzone` = bordered drop target; `button` = compact button trigger. */
  variant?: FileUploadVariant;
  size?: FileUploadSize;
  /** Accessible name of the selection preview list. Default "Selected files". */
  selectedListLabel?: string;
  /** Builds the accessible name of a preview row's remove button. Default `Remove ${fileName}`. */
  removeFileLabel?: (fileName: string) => string;
  /** Preview clear-all action label. Default "Clear all". */
  clearAllLabel?: ReactNode;
  /** Builds the accessible name of a preview row's open-lightbox trigger. Default `Preview ${fileName}`. */
  previewFileLabel?: (fileName: string) => string;
  /** Accessible name of the lightbox close button. Default "Close". */
  previewCloseLabel?: string;
  /** Accessible name of the lightbox previous-file button. Default "Previous file". */
  previewPreviousLabel?: string;
  /** Accessible name of the lightbox next-file button. Default "Next file". */
  previewNextLabel?: string;
  /** Builds the lightbox "n of m" position readout. Default `${position} of ${total}`. */
  previewPositionLabel?: (position: number, total: number) => string;
  /** Lightbox fallback for formats with no inline preview. Default "Preview not available". */
  previewUnavailableLabel?: ReactNode;
};

export type FileUploadProps = FileUploadCommonProps &
  (
    | {
        /**
         * Fire-and-forget mode: receives each batch of files that passed
         * validation; the component keeps no selection state.
         */
        onFilesSelected: (files: File[]) => void;
        files?: undefined;
        onFilesChange?: undefined;
      }
    | {
        /**
         * Controlled selection mode: the app owns the file list and a
         * confirmation preview renders under the trigger. New selections
         * replace the list in single mode and accumulate (skipping duplicate
         * files) when `multiple`.
         */
        files: File[];
        /** Receives the full next list after every select, remove, or clear. */
        onFilesChange: (files: File[]) => void;
        /** Optional in this mode: still receives each newly accepted batch. */
        onFilesSelected?: (files: File[]) => void;
      }
  );

/**
 * `accept` matching mirrors the native picker filter: `.ext` suffixes match
 * the file name, `type/*` wildcards match the MIME prefix, exact MIME types
 * match verbatim.
 */
function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .filter((pattern) => pattern.length > 0);
  if (patterns.length === 0) {
    return true;
  }
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) {
      return name.endsWith(pattern);
    }
    if (pattern.endsWith("/*")) {
      return type.startsWith(pattern.slice(0, -1));
    }
    return type === pattern;
  });
}

function defaultDescription(accept: string | undefined, maxSizeBytes: number | undefined) {
  const parts: string[] = [];
  if (accept !== undefined && accept.trim().length > 0) {
    parts.push(
      `Accepted: ${accept
        .split(",")
        .map((pattern) => pattern.trim())
        .join(", ")}`,
    );
  }
  if (maxSizeBytes !== undefined) {
    parts.push(`Max ${formatBytes(maxSizeBytes)}`);
  }
  if (parts.length === 0) {
    return undefined;
  }
  return parts.join(" · ");
}

/**
 * Single mode replaces the selection; multiple mode appends, skipping files
 * already in the list (same name, size, mtime, and type). Returns `current`
 * unchanged when nothing new arrived so callers can skip a no-op change.
 */
function mergeSelection(current: File[], accepted: File[], multiple: boolean): File[] {
  if (!multiple) {
    return accepted.slice(0, 1);
  }
  const seen = new Set(current.map(fileKey));
  const fresh = accepted.filter((file) => {
    const key = fileKey(file);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  if (fresh.length === 0) {
    return current;
  }
  return [...current, ...fresh];
}

export function FileUpload(props: FileUploadProps) {
  const {
    accept,
    multiple = false,
    disabled = false,
    maxSizeBytes,
    onInvalidFiles,
    label,
    description,
    busy = false,
    variant = "dropzone",
    size = "default",
    selectedListLabel,
    removeFileLabel,
    clearAllLabel,
    previewFileLabel,
    previewCloseLabel,
    previewPreviousLabel,
    previewNextLabel,
    previewPositionLabel,
    previewUnavailableLabel,
  } = props;
  const selection =
    props.files === undefined
      ? undefined
      : { files: props.files, onFilesChange: props.onFilesChange };
  const notifySelected = props.onFilesSelected;

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const labelId = useId();
  const descriptionId = useId();

  const interactive = !disabled && !busy;
  const labelContent = label ?? (multiple ? "Upload files" : "Upload a file");
  const descriptionContent = description ?? defaultDescription(accept, maxSizeBytes);

  const selectFiles = (candidates: File[]) => {
    const scoped = multiple ? candidates : candidates.slice(0, 1);
    const accepted: File[] = [];
    const rejections: FileUploadRejection[] = [];
    for (const file of scoped) {
      if (accept !== undefined && !matchesAccept(file, accept)) {
        rejections.push({ file, reason: "type" });
        continue;
      }
      if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
        rejections.push({ file, reason: "size" });
        continue;
      }
      accepted.push(file);
    }
    if (rejections.length > 0) {
      onInvalidFiles?.(rejections);
    }
    if (accepted.length === 0) {
      return;
    }
    if (selection !== undefined) {
      const next = mergeSelection(selection.files, accepted, multiple);
      if (next !== selection.files) {
        selection.onFilesChange(next);
      }
    }
    notifySelected?.(accepted);
  };

  const openPicker = () => {
    if (interactive) {
      inputRef.current?.click();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      selectFiles(Array.from(event.target.files));
    }
    // Reset so re-selecting the same file fires change again.
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (interactive) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (interactive) {
      selectFiles(Array.from(event.dataTransfer.files));
    }
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      className={fileUploadInputVariants()}
      accept={accept}
      multiple={multiple}
      disabled={!interactive}
      tabIndex={-1}
      aria-hidden="true"
      onChange={handleChange}
    />
  );

  const preview =
    selection === undefined ? undefined : (
      <FileUploadPreview
        files={selection.files}
        disabled={disabled || busy}
        onRemove={(file) =>
          selection.onFilesChange(selection.files.filter((candidate) => candidate !== file))
        }
        onClearAll={() => selection.onFilesChange([])}
        listLabel={selectedListLabel}
        removeLabel={removeFileLabel}
        clearAllLabel={clearAllLabel}
        previewLabel={previewFileLabel}
        closeLabel={previewCloseLabel}
        previousLabel={previewPreviousLabel}
        nextLabel={previewNextLabel}
        positionLabel={previewPositionLabel}
        previewUnavailableLabel={previewUnavailableLabel}
      />
    );

  if (variant === "button") {
    return (
      <Div className={fileUploadRootVariants({ trigger: "button" })}>
        <Button
          type="button"
          variant="outline"
          size={size === "sm" ? "sm" : "default"}
          aria-disabled={disabled || busy || undefined}
          aria-busy={busy || undefined}
          onClick={openPicker}
        >
          {busy ? <SpinnerEl size="sm" /> : <UploadCloud aria-hidden="true" />}
          {labelContent}
        </Button>
        {input}
        {preview}
      </Div>
    );
  }

  return (
    <Div className={fileUploadRootVariants({ trigger: "dropzone" })}>
      <button
        type="button"
        className={fileUploadDropzoneVariants({
          size,
          dragOver,
          disabled,
          busy,
        })}
        aria-labelledby={labelId}
        aria-describedby={descriptionContent !== undefined ? descriptionId : undefined}
        aria-disabled={disabled || busy || undefined}
        aria-busy={busy || undefined}
        data-drag-over={dragOver || undefined}
        onClick={openPicker}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className={fileUploadIconVariants()}>
          {busy ? <SpinnerEl size="default" /> : <UploadCloud aria-hidden="true" />}
        </span>
        <span id={labelId} className={fileUploadLabelVariants()}>
          {labelContent}
        </span>
        {descriptionContent !== undefined && (
          <span id={descriptionId} className={fileUploadDescriptionVariants()}>
            {descriptionContent}
          </span>
        )}
      </button>
      {input}
      {preview}
    </Div>
  );
}
