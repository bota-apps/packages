import { useId, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "../button";
import { SpinnerEl } from "../html";
import {
  fileUploadDescriptionVariants,
  fileUploadDropzoneVariants,
  fileUploadIconVariants,
  fileUploadInputVariants,
  fileUploadLabelVariants,
  type FileUploadSize,
} from "./variants";

export * from "./variants";

export type FileUploadRejection = {
  file: File;
  reason: "size" | "type";
};

export type FileUploadVariant = "dropzone" | "button";

export type FileUploadProps = {
  /** Receives the files that passed validation. */
  onFilesSelected: (files: File[]) => void;
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
};

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

const byteUnits = ["B", "KB", "MB", "GB", "TB"];

function formatBytes(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < byteUnits.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${rounded} ${byteUnits[unit]}`;
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

export function FileUpload({
  onFilesSelected,
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
}: FileUploadProps) {
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
    if (accepted.length > 0) {
      onFilesSelected(accepted);
    }
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

  if (variant === "button") {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
    </>
  );
}
