import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertDescription } from "../alert";
import { P } from "../html";
import { FileUpload, type FileUploadRejection } from "./index";

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
};
export default meta;

type Story = StoryObj<typeof FileUpload>;

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
