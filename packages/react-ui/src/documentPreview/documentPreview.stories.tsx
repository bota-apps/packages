import type { Meta, StoryObj } from "@storybook/react";
import { DocumentPreview } from "./index";

const meta: Meta<typeof DocumentPreview> = {
  title: "Display/DocumentPreview",
  component: DocumentPreview,
};
export default meta;

type Story = StoryObj<typeof DocumentPreview>;

export const Image: Story = {
  args: {
    url: "https://picsum.photos/seed/bota/900/600",
    name: "site-photo.jpg",
    mimeType: "image/jpeg",
  },
};

export const OfficeViewerDisabled: Story = {
  name: "Office (viewer opted out)",
  args: {
    url: "https://files.example.com/report.docx",
    name: "report.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Privacy-sensitive apps disable the third-party viewer; download/open remain.
    officeViewerUrl: null,
  },
};
