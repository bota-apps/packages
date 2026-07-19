---
"@bota-apps/react-ui": minor
---

FileUpload selection preview rows now open a full-size lightbox. Activating a
row (its thumbnail/name area is a button labelled "Preview {name}") opens a
modal viewer: images and PDFs embed inline via object URLs (revoked when the
stage unmounts), other formats show their format icon with a "Preview not
available" fallback. With more than one file selected the lightbox pages
through the whole selection — Previous/Next buttons, an "n of m" position
readout, and ArrowLeft/ArrowRight keys — and a remove action deletes the
staged file, staging the next one (closing when none remain).

New overridable strings: `FileUploadPreview` gains `previewLabel`,
`closeLabel`, `previousLabel`, `nextLabel`, `positionLabel`, and
`previewUnavailableLabel`; `FileUpload` forwards them as `previewFileLabel`,
`previewCloseLabel`, `previewPreviousLabel`, `previewNextLabel`,
`previewPositionLabel`, and `previewUnavailableLabel`. New variants:
`fileUploadPreviewTriggerVariants` and the `fileUploadLightbox*` family
(content, stage, image, footer, nav, position).
