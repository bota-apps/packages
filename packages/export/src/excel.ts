import * as XLSX from "xlsx";

import type { ExportRow } from "./types";

export function exportToExcel(filename: string, headers: string[], rows: ExportRow[]): void {
  const keys = Object.keys(rows[0] ?? {});
  const data = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    keys.forEach((key, i) => {
      obj[headers[i] ?? key] = row[key];
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
