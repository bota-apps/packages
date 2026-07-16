---
"@bota-apps/react-ui": minor
---

Add `FileUpload` — a file selection control with `dropzone` and `button` variants. A visually hidden `<input type="file">` is driven by a real button (full keyboard support), the dropzone accepts drag-and-drop with a visible drag-over state, and client-side validation routes files failing `accept`/`maxSizeBytes` to `onInvalidFiles` with a typed reason (`"size" | "type"`). Labels and the hint line are injectable with English defaults (the hint derives from `accept`/`maxSizeBytes` when set), and `busy`/`disabled` states are announced via `aria-busy`/`aria-disabled`. Exports `FileUploadProps`, `FileUploadRejection`, `FileUploadVariant`, `FileUploadSize`, and the cva variants.
