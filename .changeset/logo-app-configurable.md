---
"@bota-apps/react-ui": minor
---

`Logo` is now app-configurable instead of hard-coding a wordmark and asset path. New props: `name` (wordmark text, default `"Bota Apps"`), `src` (image source, default `"/images/logo.png"`), and `alt` (defaults to `"<name> logo"`).

Migration: apps that relied on the previously baked-in wordmark must now pass their own `name` (and optionally `src`/`alt`). No exports were removed; `logoVariants` is unchanged.
