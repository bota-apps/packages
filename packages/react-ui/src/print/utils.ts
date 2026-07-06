import type { PrintLayoutOptions } from "./types";

export function buildPrintPageStyle(layout?: PrintLayoutOptions, extra?: string): string {
  const paperSize = layout?.paperSize ?? "A4";
  const orientation = layout?.orientation ?? "portrait";
  const margin = layout?.margin ?? "12mm";

  return `
    @page {
      size: ${paperSize} ${orientation};
      margin: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: white;
    }

    body {
      padding: ${margin};
    }

    @media print {
      .screen-only { display: none !important; }
      .print-only { display: block !important; }
      .print-page-break { break-before: page; }
      .print-break-inside-avoid { break-inside: avoid; }
    }

    ${extra ?? ""}
  `;
}

export async function waitForDocumentFonts(doc: Document): Promise<void> {
  const fonts = (doc as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
  if (fonts?.ready) {
    await fonts.ready;
  }
}

export async function waitForImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images);
  await Promise.all(
    images.map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }),
  );
}
