import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { ExportRow } from "./types";

export function exportToPdf(
  filename: string,
  title: string,
  headers: string[],
  rows: ExportRow[],
): void {
  const doc = new jsPDF();
  const keys = Object.keys(rows[0] ?? {});

  doc.setFontSize(16);
  doc.text(title, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: rows.map((row) => keys.map((k) => String(row[k] ?? ""))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`${filename}.pdf`);
}
