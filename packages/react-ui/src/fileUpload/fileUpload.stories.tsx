import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertDescription } from "../alert";
import { P } from "../html";
import { FileUpload, FileUploadPreview, type FileUploadRejection } from "./index";

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
};
export default meta;

type Story = StoryObj<typeof FileUpload>;

// 1×1 PNG so image rows render a real object-URL thumbnail in the preview.
const pngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function sampleImage(name: string): File {
  const bytes = Uint8Array.from(atob(pngBase64), (char) => char.charCodeAt(0));
  return new File([bytes], name, { type: "image/png", lastModified: 1 });
}

function sampleDocument(name: string, type: string, sizeBytes: number): File {
  return new File([new Uint8Array(sizeBytes)], name, { type, lastModified: 1 });
}

function DropzoneDemo() {
  const [names, setNames] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <FileUpload
        accept=".pdf,image/*"
        maxSizeBytes={5 * 1024 * 1024}
        onFilesSelected={(files) => setNames(files.map((file) => file.name))}
      />
      {names.length > 0 && <P variant="muted">Selected: {names.join(", ")}</P>}
    </div>
  );
}

export const Dropzone: Story = {
  render: () => <DropzoneDemo />,
};

function MultipleDemo() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <FileUpload multiple onFilesSelected={(files) => setCount(files.length)} />
      {count > 0 && <P variant="muted">{count} file(s) selected</P>}
    </div>
  );
}

export const Multiple: Story = {
  render: () => <MultipleDemo />,
};

function SingleWithPreviewDemo() {
  const [files, setFiles] = useState<File[]>([
    sampleDocument("annual-statement.pdf", "application/pdf", 48 * 1024),
  ]);
  return (
    <FileUpload
      accept=".pdf,image/*"
      maxSizeBytes={5 * 1024 * 1024}
      files={files}
      onFilesChange={setFiles}
    />
  );
}

/** Controlled single selection: picking another file replaces the current one. */
export const SingleWithPreview: Story = {
  render: () => <SingleWithPreviewDemo />,
};

function MultipleWithPreviewDemo() {
  const [files, setFiles] = useState<File[]>([
    sampleDocument("annual-statement.pdf", "application/pdf", 48 * 1024),
    sampleImage("site-photo.png"),
    sampleDocument("line-items.csv", "text/csv", 3 * 1024),
  ]);
  return <FileUpload multiple files={files} onFilesChange={setFiles} />;
}

/**
 * Controlled multi selection: new picks accumulate, duplicates are skipped.
 * Activating a row opens the full-size lightbox; Previous/Next (or arrow
 * keys) page through the whole selection.
 */
export const MultipleWithPreview: Story = {
  render: () => <MultipleWithPreviewDemo />,
};

function LightboxDemo() {
  const [files, setFiles] = useState<File[]>([
    sampleImage("scan-front.png"),
    sampleImage("scan-back.png"),
    sampleDocument("annual-statement.pdf", "application/pdf", 48 * 1024),
    sampleDocument("line-items.csv", "text/csv", 3 * 1024),
  ]);
  return (
    <div className="flex flex-col gap-4">
      <FileUpload multiple accept=".pdf,.csv,image/*" files={files} onFilesChange={setFiles} />
      <P variant="muted">
        Click a row to inspect it full-size; page with the footer buttons or arrow keys. Images and
        PDFs embed inline, other formats fall back to their format icon.
      </P>
    </div>
  );
}

/** Row click → full-size lightbox with paging across the selection. */
export const PreviewLightbox: Story = {
  render: () => <LightboxDemo />,
};

function ButtonWithPreviewDemo() {
  const [files, setFiles] = useState<File[]>([sampleImage("site-photo.png")]);
  return (
    <FileUpload
      variant="button"
      accept="image/*"
      label="Attach image"
      files={files}
      onFilesChange={setFiles}
    />
  );
}

export const ButtonWithPreview: Story = {
  render: () => <ButtonWithPreviewDemo />,
};

function NarrowContainerDemo() {
  const [files, setFiles] = useState<File[]>([
    sampleDocument(
      "very-long-descriptive-document-name-that-truncates.pdf",
      "application/pdf",
      512 * 1024,
    ),
    sampleImage("site-photo.png"),
  ]);
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-56">
        <FileUpload multiple files={files} onFilesChange={setFiles} />
      </div>
      <div className="w-full max-w-3xl">
        <FileUpload multiple files={files} onFilesChange={setFiles} />
      </div>
    </div>
  );
}

/** The same control in a narrow card and a wide panel — layout follows the container. */
export const ContainerResponsive: Story = {
  render: () => <NarrowContainerDemo />,
};

function StandalonePreviewDemo() {
  const [files, setFiles] = useState<File[]>([
    sampleDocument("annual-statement.pdf", "application/pdf", 48 * 1024),
    sampleDocument("line-items.csv", "text/csv", 3 * 1024),
  ]);
  return (
    <div className="flex flex-col gap-4">
      <FileUploadPreview
        files={files}
        onRemove={(file) =>
          setFiles((current) => current.filter((candidate) => candidate !== file))
        }
        onClearAll={() => setFiles([])}
      />
      {files.length === 0 && <P variant="muted">Nothing selected.</P>}
    </div>
  );
}

/** The preview composed on its own, away from the trigger. */
export const StandalonePreview: Story = {
  render: () => <StandalonePreviewDemo />,
};

export const ButtonVariant: Story = {
  render: () => (
    <FileUpload
      variant="button"
      accept=".csv"
      onFilesSelected={() => undefined}
      label="Import CSV"
    />
  ),
};

export const Busy: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FileUpload busy onFilesSelected={() => undefined} />
      <FileUpload busy variant="button" onFilesSelected={() => undefined} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FileUpload disabled onFilesSelected={() => undefined} />
      <FileUpload disabled variant="button" onFilesSelected={() => undefined} />
    </div>
  ),
};

function InvalidTypeDemoStory() {
  const [rejections, setRejections] = useState<FileUploadRejection[]>([]);
  const [accepted, setAccepted] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <FileUpload
        accept=".pdf"
        maxSizeBytes={1024 * 1024}
        onFilesSelected={(files) => {
          setRejections([]);
          setAccepted(files.map((file) => file.name));
        }}
        onInvalidFiles={(invalid) => {
          setAccepted([]);
          setRejections(invalid);
        }}
      />
      {accepted.length > 0 && <P variant="muted">Accepted: {accepted.join(", ")}</P>}
      {rejections.length > 0 && (
        <Alert variant="error">
          <AlertDescription>
            {rejections
              .map(
                ({ file, reason }) =>
                  `${file.name}: ${reason === "type" ? "unsupported format" : "too large"}`,
              )
              .join("; ")}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export const InvalidTypeDemo: Story = {
  render: () => <InvalidTypeDemoStory />,
};

export const SmallDropzone: Story = {
  render: () => <FileUpload size="sm" onFilesSelected={() => undefined} />,
};
