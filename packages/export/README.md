# @bota-apps/export

Framework-free, client-side data export. Turn a `headers` array plus an array of
plain row objects into a file the browser downloads — CSV, XLSX, or PDF. No
React, no server round-trip: each helper builds the file in the browser and
triggers the download.

Row keys drive column order (taken from the first row); `headers` supplies the
display labels, positionally aligned to those keys.

## Install

```bash
pnpm add @bota-apps/export
```

Dependencies are per subpath, so you only pay for the format you import:

- `@bota-apps/export/csv` — dependency-free.
- `@bota-apps/export/excel` — pulls in [`xlsx`](https://www.npmjs.com/package/xlsx).
- `@bota-apps/export/pdf` — pulls in [`jspdf`](https://www.npmjs.com/package/jspdf)
  and [`jspdf-autotable`](https://www.npmjs.com/package/jspdf-autotable).

Importing the barrel (`@bota-apps/export`) reaches all three, so prefer a single
format's subpath when the format is fixed at build time.

## Usage

Every helper takes a `filename` (no extension — the format's extension is
appended) followed by the `headers` labels and the `rows`. A row is an
`ExportRow` — `Record<string, string | number | boolean | null | undefined>`.

CSV — the lean, dependency-free path:

```ts
import { exportToCsv } from "@bota-apps/export/csv";

exportToCsv("projects", ["Name", "Department"], [{ name: "Jane Doe", department: "Engineering" }]);
// downloads projects.csv
```

Excel — the same shape, one column per row key on a sheet named `Report`:

```ts
import { exportToExcel } from "@bota-apps/export/excel";

exportToExcel("projects", ["Name", "Department"], rows);
// downloads projects.xlsx
```

PDF — takes an extra `title` argument, rendered above an auto-laid-out table:

```ts
import { exportToPdf } from "@bota-apps/export/pdf";

exportToPdf("projects", "Project Roster", ["Name", "Department"], rows);
// downloads projects.pdf
```

When the format is chosen at runtime, use the `exportTable` dispatcher on the
barrel. It forwards to the matching helper (and `title` is used by the PDF
format only):

```ts
import { exportTable, type ExportFormat } from "@bota-apps/export";

const format: ExportFormat = "pdf"; // "csv" | "excel" | "pdf"
exportTable(format, "project-summary", "Project Summary", headers, rows);
```

## Subpaths

Each format is its own entry so you only bundle the dependency you use:

| Import                       | Exports                                                            | Deps pulled                |
| ---------------------------- | ------------------------------------------------------------------ | -------------------------- |
| `@bota-apps/export/csv`      | `exportToCsv`                                                      | none                       |
| `@bota-apps/export/excel`    | `exportToExcel`                                                    | `xlsx`                     |
| `@bota-apps/export/pdf`      | `exportToPdf`                                                      | `jspdf`, `jspdf-autotable` |
| `@bota-apps/export` (barrel) | `exportTable`, `ExportFormat`, `ExportRow`, plus all three helpers | all of the above           |

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
