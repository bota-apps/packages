import type { ExportRow } from "./types";

function escapeCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(filename: string, headers: string[], rows: ExportRow[]): void {
  const keys = Object.keys(rows[0] ?? {});
  const headerLine = headers.map(escapeCell).join(",");
  const dataLines = rows.map((row) => keys.map((k) => escapeCell(row[k])).join(","));
  const csv = [headerLine, ...dataLines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
