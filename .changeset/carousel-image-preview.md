---
"@bota-apps/react-ui": minor
---

New `Carousel` and `ImagePreview` components for in-app media preview.

- `Carousel` pages through its children one slide at a time: previous/next
  buttons, an "n of m" readout (`positionLabel`), and arrow-key paging. The
  pager only renders for two or more slides; end-of-range buttons stay
  focusable (`aria-disabled`) so keyboard focus never drops mid-interaction.
  `arrowKeys="document"` keeps paging alive inside modal dialogs. Supports
  controlled (`index`/`onIndexChange`) and uncontrolled (`defaultIndex`)
  modes, `stageSize` variants, and injectable labels.
- `ImagePreview` renders a single image as a thumbnail trigger opening an
  in-app full-size preview dialog — instead of a navigation link to the image
  URL. Thumbnail `sm`/`default`/`lg` sizes, injectable `previewLabel`/
  `closeLabel`, letterboxed stage shared with the carousel.
- New variants: `carousel*` (root, stage, slide, image, footer, position) and
  `imagePreview*` (trigger, thumbnail, content).
