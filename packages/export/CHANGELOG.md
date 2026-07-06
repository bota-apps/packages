# @bota-apps/export

## 0.1.0

### Minor Changes

- 0d6b4ac: New package: framework-free client-side data export (CSV / XLSX / PDF).

  Extracted from a host app's app-local `src/export`. Provides
  `exportToCsv`, `exportToExcel`, `exportToPdf`, and an `exportTable(format, …)`
  dispatcher. Each format is a separate subpath (`./csv`, `./excel`, `./pdf`) so
  CSV-only consumers stay dependency-free while `./excel`/`./pdf` isolate the
  heavy `xlsx`/`jspdf` deps.
