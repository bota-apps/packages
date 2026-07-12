---
"@bota-apps/react-ui": minor
---

Scroll-aware motion primitives — communicate arrival, magnitude, and process without any new runtime dependency (IntersectionObserver + CSS transitions + rAF on the existing motion tokens).

New components:

- `Reveal` / `RevealGroup` — one-time entrance (`fade` | `fadeUp` | `fadeDown` | `zoom`) when content first scrolls into view; `RevealGroup` staggers its children. Server markup, reduced-motion users, and browsers without IntersectionObserver always render the resting state — content is never stranded hidden.
- `AnimatedNumber` — counts up when first visible and tweens between value changes. Sized by the final value so there is no layout shift, tabular figures, aria-hidden frames with the final value exposed to assistive technology; snaps instantly under reduced motion.
- `StepFlow` — numbered vertical walkthrough for process storytelling: a progress rail fills as the reader scrolls, passed steps solidify, the current step highlights with the selected tokens. All movement is scrubbed 1:1 by the reader's own scrolling.
- `usePrefersReducedMotion` — reactive reduced-motion flag the primitives are built on, exported for app-level motion.

Extended:

- `Hero` gained the animated `treatment="aurora"`: two blurred ramp-tinted blobs drifting on the new preset keyframes — transform-only, brand/dark-aware through the numeric ramps, and stilled under `motion-reduce`.
- New `Ol` primitive in the html layer (ordered-list counterpart to `Ul`).
