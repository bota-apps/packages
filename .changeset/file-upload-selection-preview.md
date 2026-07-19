---
"@bota-apps/react-ui": minor
---

FileUpload: pre-upload selection preview, controlled selection mode, and container-responsive layout.

- New controlled mode: pass `files` + `onFilesChange` and the control renders a confirmation preview under the trigger (both `dropzone` and `button` variants). The app keeps ownership of the file list; `onFilesSelected` stays available for each accepted batch. The existing fire-and-forget mode (`onFilesSelected` alone) is unchanged.
- Selection semantics: in single mode a new pick replaces the current selection; with `multiple`, picks accumulate and identical files (same name, size, mtime, type) are skipped. Validation rejections (`accept`/`maxSizeBytes` → `onInvalidFiles`) work in both modes.
- New `FileUploadPreview` component (exported from the module, also usable standalone): image rows render object-URL thumbnails (revoked on removal/unmount), other formats reuse the shared file-format icon with name and human-readable size; per-row remove buttons with accessible names, and a clear-all action for multi-file selections. Labels are overridable (`selectedListLabel`, `removeFileLabel`, `clearAllLabel` on FileUpload; `listLabel`, `removeLabel`, `clearAllLabel` on the preview).
- Container-scoped responsiveness: the control now renders its own `@container` wrapper; dropzone padding/icon scale with the container, preview rows go two-column in wide containers, and long file names truncate. Markup note: the trigger and hidden input are now wrapped in a `div` (previously a fragment) — styling that assumed the trigger was a direct child of the consumer's layout may need a look.
- New variant exports: `fileUploadRootVariants` (+ `FileUploadRootVariantProps`) and the `fileUploadPreview*Variants` family.
