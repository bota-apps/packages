---
"@bota-apps/react-components": minor
---

`IssueDetails` previews screenshots in-app instead of opening a new tab.

Screenshot thumbnails are now preview triggers: a lone screenshot opens an
`ImagePreview` dialog, several share one dialog staging a `Carousel` opened
at the clicked screenshot (previous/next, "n of m" readout, arrow-key
paging). Screenshots without a URL keep the file-name chip fallback.

New optional `IssueDetailsTranslations` keys (English defaults):
`previewScreenshotLabel(fileName)`, `closePreviewLabel`,
`previousScreenshotLabel`, `nextScreenshotLabel`, and
`screenshotPositionLabel(position, total)`. Translation overrides now merge
per-key, so explicitly-undefined keys fall back to the defaults.
