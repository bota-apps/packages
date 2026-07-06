import { exportToCsv } from "./csv";
import { exportToExcel } from "./excel";
import { exportToPdf } from "./pdf";
import type { ExportRow } from "./types";

export { exportToCsv } from "./csv";
export { exportToExcel } from "./excel";
export { exportToPdf } from "./pdf";
export type { ExportRow } from "./types";

export type ExportFormat = "csv" | "excel" | "pdf";

/**
 * Export tabular data in a format chosen at runtime. Pulls every format's
 * dependency (xlsx, jspdf) — import a single format's subpath
 * (`@bota-apps/export/csv`) to keep the bundle lean. `title` is used by the PDF
 * format only.
 */
export function exportTable(
  format: ExportFormat,
  filename: string,
  title: string,
  headers: string[],
  rows: ExportRow[],
): void {
  switch (format) {
    case "csv": {
      exportToCsv(filename, headers, rows);
      break;
    }
    case "excel": {
      exportToExcel(filename, headers, rows);
      break;
    }
    case "pdf": {
      exportToPdf(filename, title, headers, rows);
      break;
    }
  }
}
