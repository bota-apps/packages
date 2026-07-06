import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  File,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Span } from "../html/span";
import { cn } from "../lib/utils";
import { fileFormatIconVariants } from "./variants";

export type FileFormat =
  "pdf" | "image" | "word" | "spreadsheet" | "presentation" | "archive" | "unknown";

const iconByFormat: Record<FileFormat, LucideIcon> = {
  pdf: FileText,
  image: FileImage,
  word: FileText,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  archive: FileArchive,
  unknown: File,
};

export function resolveFileFormat(mimeType?: string, url?: string): FileFormat {
  const m = (mimeType ?? "").toLowerCase();
  if (m === "application/pdf") {
    return "pdf";
  }
  if (m.startsWith("image/")) {
    return "image";
  }
  if (
    m === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    m === "application/msword"
  ) {
    return "word";
  }
  if (
    m === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    m === "application/vnd.ms-excel"
  ) {
    return "spreadsheet";
  }
  if (
    m === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    m === "application/vnd.ms-powerpoint"
  ) {
    return "presentation";
  }
  if (m === "application/zip" || m === "application/x-tar" || m === "application/x-7z-compressed") {
    return "archive";
  }

  const ext = extractExtension(url);
  if (!ext) {
    return "unknown";
  }
  if (ext === "pdf") {
    return "pdf";
  }
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "heic"].includes(ext)) {
    return "image";
  }
  if (ext === "doc" || ext === "docx") {
    return "word";
  }
  if (ext === "xls" || ext === "xlsx" || ext === "csv") {
    return "spreadsheet";
  }
  if (ext === "ppt" || ext === "pptx") {
    return "presentation";
  }
  if (["zip", "tar", "gz", "7z", "rar"].includes(ext)) {
    return "archive";
  }
  return "unknown";
}

function extractExtension(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }
  const withoutQuery = url.split("?")[0] ?? "";
  const parts = withoutQuery.split(".");
  if (parts.length < 2) {
    return undefined;
  }
  return parts[parts.length - 1]?.toLowerCase();
}

export type FileFormatIconProps = {
  mimeType?: string;
  url?: string;
  /** Override auto-detected format (takes precedence over mimeType/url). */
  format?: FileFormat;
  size?: VariantProps<typeof fileFormatIconVariants>["size"];
};

export function FileFormatIcon({ mimeType, url, format, size }: FileFormatIconProps) {
  const resolved = format ?? resolveFileFormat(mimeType, url);
  const Icon = iconByFormat[resolved];
  return (
    <Span className={cn(fileFormatIconVariants({ size, format: resolved }))}>
      <Icon />
    </Span>
  );
}
