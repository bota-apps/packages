---
---

No code change. `@bota-apps/testing@0.1.0` was first-published manually with `npm publish`, which does not rewrite `workspace:^`/`catalog:` protocol ranges — the manifest shipped uninstallable. `0.1.1` (same content) was republished with `pnpm publish`, which rewrites them; this records the manual version bump. First publishes of NEW packages cannot go through the OIDC release workflow (npm Trusted Publishing 404s on package creation) — publish once manually with `pnpm publish --access public`, then CI handles subsequent releases.
