import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline } from "../html/layout";
import { ImagePreview } from "./index";

function placeholderImage(label: string, background: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${background}"/><circle cx="290" cy="210" r="60" fill="white" opacity="0.7"/><rect x="180" y="320" width="440" height="28" rx="14" fill="white" opacity="0.7"/><text x="400" y="120" font-family="sans-serif" font-size="36" fill="white" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const meta: Meta<typeof ImagePreview> = {
  title: "Display/ImagePreview",
  component: ImagePreview,
};
export default meta;

type Story = StoryObj<typeof ImagePreview>;

export const Default: Story = {
  render: () => (
    <ImagePreview src={placeholderImage("Attachment", "#64748b")} alt="attachment.png" />
  ),
};

export const ThumbnailSizes: Story = {
  render: () => (
    <Inline gap="sm" align="end">
      <ImagePreview src={placeholderImage("Small", "#64748b")} alt="small.png" thumbnailSize="sm" />
      <ImagePreview src={placeholderImage("Default", "#0d9488")} alt="default.png" />
      <ImagePreview src={placeholderImage("Large", "#7c3aed")} alt="large.png" thumbnailSize="lg" />
    </Inline>
  ),
};

export const LocalizedLabels: Story = {
  render: () => (
    <ImagePreview
      src={placeholderImage("ማያያዣ", "#64748b")}
      alt="ማያያዣ"
      previewLabel="ቅድመ እይታ"
      closeLabel="ዝጋ"
    />
  ),
};
