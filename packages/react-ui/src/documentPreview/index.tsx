import { useCallback, useMemo } from "react";
import { Download, Printer, Share2, ExternalLink } from "lucide-react";
import { Button } from "../button";
import { Stack, Inline } from "../html/layout";
import { Heading, Text } from "../html/typography";
import { Div } from "../html/div";
import { Img } from "../html/img";
import { Iframe } from "../html/iframe";
import { FileFormatIcon } from "./fileFormatIcon";
import {
  resolvePreviewKind,
  type DocumentPreviewAction,
  type DocumentPreviewActionItem,
} from "./types";

export * from "./types";
export {
  FileFormatIcon,
  resolveFileFormat,
  type FileFormatIconProps,
  type FileFormat,
} from "./fileFormatIcon";
export * from "./variants";

const defaultActions: DocumentPreviewAction[] = ["open", "download", "print", "share"];

const actionLabels: Record<DocumentPreviewAction, string> = {
  open: "Open in new tab",
  download: "Download",
  print: "Print",
  share: "Share",
};

const actionIcons: Record<DocumentPreviewAction, typeof Download> = {
  open: ExternalLink,
  download: Download,
  print: Printer,
  share: Share2,
};

/**
 * Default office-document viewer: Microsoft's public Office Online viewer.
 *
 * Privacy note: this sends the document URL to a Microsoft service and only
 * works for publicly reachable URLs. Pass your own `officeViewerUrl` to use a
 * self-hosted viewer, or `null` to disable office previews entirely.
 */
const defaultOfficeViewerUrl = (fileUrl: string) =>
  `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;

export type DocumentPreviewProps = {
  url: string;
  name: string;
  mimeType?: string;
  actions?: DocumentPreviewAction[];
  /** Override action handling — return true to indicate handled (skip default). */
  onAction?: (action: DocumentPreviewAction) => boolean | void;
  labels?: Partial<Record<DocumentPreviewAction, string>>;
  /** Optional slot shown in the toolbar before the action buttons (e.g. a back link). */
  toolbarLeading?: React.ReactNode;
  /** Fallback messages for unsupported files. */
  unsupportedTitle?: string;
  unsupportedDescription?: string;
  /**
   * Builds the embed URL for office documents (docx/xlsx/pptx). Defaults to
   * Microsoft's public Office Online viewer, which receives the document URL
   * and requires it to be publicly reachable. Pass `null` to opt out for
   * privacy-sensitive documents — office files then fall back to the
   * unsupported state (download/open actions still work).
   */
  officeViewerUrl?: ((fileUrl: string) => string) | null;
};

export function DocumentPreview({
  url,
  name,
  mimeType,
  actions = defaultActions,
  onAction,
  labels,
  toolbarLeading,
  unsupportedTitle = "Preview not available",
  unsupportedDescription = "This file type can't be previewed in the browser. Download it to view.",
  officeViewerUrl = defaultOfficeViewerUrl,
}: DocumentPreviewProps) {
  const kind = useMemo(() => resolvePreviewKind(mimeType, url), [mimeType, url]);

  const runDefault = useCallback(
    (action: DocumentPreviewAction) => {
      switch (action) {
        case "open": {
          window.open(url, "_blank", "noopener,noreferrer");
          break;
        }
        case "download": {
          const link = document.createElement("a");
          link.href = url;
          link.download = name;
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        }
        case "print": {
          const win = window.open(url, "_blank", "noopener,noreferrer");
          if (win) {
            win.addEventListener("load", () => {
              win.focus();
              win.print();
            });
          }
          break;
        }
        case "share": {
          const nav = navigator as Navigator & {
            share?: (data: { title?: string; url?: string }) => Promise<void>;
          };
          if (nav.share) {
            void nav.share({ title: name, url });
          } else if (navigator.clipboard) {
            void navigator.clipboard.writeText(url);
          }
          break;
        }
      }
    },
    [url, name],
  );

  const handle = useCallback(
    (action: DocumentPreviewAction) => {
      const handled = onAction?.(action);
      if (handled === true) {
        return;
      }
      runDefault(action);
    },
    [onAction, runDefault],
  );

  const actionItems: DocumentPreviewActionItem[] = useMemo(
    () =>
      actions.map((id) => ({
        id,
        label: labels?.[id] ?? actionLabels[id],
        icon: actionIcons[id],
        onClick: () => handle(id),
      })),
    [actions, labels, handle],
  );

  return (
    <Stack gap="md">
      <Inline
        as="header"
        justify="between"
        align="center"
        gap="md"
        className="rounded-md border bg-card px-4 py-3"
      >
        <Inline gap="sm" align="center" className="min-w-0">
          {toolbarLeading}
          <FileFormatIcon mimeType={mimeType} url={url} size="md" />
          <Stack gap="none" className="min-w-0">
            <Heading as="h2" size="sm" className="truncate">
              {name}
            </Heading>
            {mimeType ? (
              <Text tone="muted" size="sm" className="truncate">
                {mimeType}
              </Text>
            ) : null}
          </Stack>
        </Inline>
        <Inline gap="xs" align="center" wrap>
          {actionItems.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={action.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={action.onClick}
                aria-label={action.label}
              >
                <ActionIcon />
                <Text as="span" size="sm" className="hidden md:inline">
                  {action.label}
                </Text>
              </Button>
            );
          })}
        </Inline>
      </Inline>

      <Div
        layout="center"
        className="h-[calc(100vh-14rem)] min-h-[560px] overflow-hidden rounded-md border bg-muted"
      >
        <PreviewBody
          kind={kind}
          url={url}
          name={name}
          mimeType={mimeType}
          unsupportedTitle={unsupportedTitle}
          unsupportedDescription={unsupportedDescription}
          downloadLabel={labels?.download ?? actionLabels.download}
          openLabel={labels?.open ?? actionLabels.open}
          officeViewerUrl={officeViewerUrl}
          onDownload={() => handle("download")}
          onOpen={() => handle("open")}
        />
      </Div>
    </Stack>
  );
}

type PreviewBodyProps = {
  kind: ReturnType<typeof resolvePreviewKind>;
  url: string;
  name: string;
  mimeType?: string;
  unsupportedTitle: string;
  unsupportedDescription: string;
  downloadLabel: string;
  openLabel: string;
  officeViewerUrl: ((fileUrl: string) => string) | null;
  onDownload: () => void;
  onOpen: () => void;
};

function PreviewBody({
  kind,
  url,
  name,
  mimeType,
  unsupportedTitle,
  unsupportedDescription,
  downloadLabel,
  openLabel,
  officeViewerUrl,
  onDownload,
  onOpen,
}: PreviewBodyProps) {
  if (kind === "image") {
    return <Img src={url} alt={name} className="max-h-full max-w-full object-contain" />;
  }
  if (kind === "pdf") {
    return <Iframe src={url} title={name} variant="preview" />;
  }
  if (kind === "office" && officeViewerUrl) {
    return <Iframe src={officeViewerUrl(url)} title={name} variant="preview" />;
  }
  return (
    <Stack gap="md" align="center" className="p-8">
      <FileFormatIcon mimeType={mimeType} url={url} size="lg" />
      <Stack gap="xs" align="center">
        <Heading as="h3" size="sm">
          {unsupportedTitle}
        </Heading>
        <Text tone="muted" size="sm" align="center">
          {unsupportedDescription}
        </Text>
      </Stack>
      <Inline gap="sm">
        <Button type="button" variant="default" onClick={onDownload}>
          <Download />
          <Text as="span" size="sm">
            {downloadLabel}
          </Text>
        </Button>
        <Button type="button" variant="outline" onClick={onOpen}>
          <ExternalLink />
          <Text as="span" size="sm">
            {openLabel}
          </Text>
        </Button>
      </Inline>
    </Stack>
  );
}
