import type { PrintDocumentType, PrintLayoutOptions } from "./types";

export const printDocumentDefaults: Record<
  PrintDocumentType,
  { layout: PrintLayoutOptions; pageStyle?: string }
> = {
  "task-summary": {
    layout: { paperSize: "A4", orientation: "portrait", margin: "12mm" },
    pageStyle: `
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    `,
  },
  "project-summary": {
    layout: { paperSize: "A4", orientation: "landscape", margin: "10mm" },
  },
  "member-summary": {
    layout: { paperSize: "A4", orientation: "portrait", margin: "12mm" },
  },
  "organization-profile": {
    layout: { paperSize: "A4", orientation: "portrait", margin: "12mm" },
  },
  report: {
    layout: { paperSize: "A4", orientation: "landscape", margin: "10mm" },
  },
  generic: {
    layout: { paperSize: "A4", orientation: "portrait", margin: "12mm" },
  },
};
