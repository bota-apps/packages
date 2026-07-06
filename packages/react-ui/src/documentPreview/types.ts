import type { LucideIcon } from "lucide-react";

export type DocumentPreviewAction = "open" | "download" | "print" | "share";

export type DocumentPreviewActionItem = {
  id: DocumentPreviewAction;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

export type PreviewKind = "image" | "pdf" | "office" | "unsupported";

export function resolvePreviewKind(mimeType?: string, url?: string): PreviewKind {
  const m = (mimeType ?? "").toLowerCase();
  if (m.startsWith("image/")) {
    return "image";
  }
  if (m === "application/pdf") {
    return "pdf";
  }
  if (
    m === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    m === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    m === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    m === "application/msword" ||
    m === "application/vnd.ms-excel" ||
    m === "application/vnd.ms-powerpoint"
  ) {
    return "office";
  }

  const ext = extractExtension(url);
  if (!ext) {
    return "unsupported";
  }
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext)) {
    return "image";
  }
  if (ext === "pdf") {
    return "pdf";
  }
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
    return "office";
  }
  return "unsupported";
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
