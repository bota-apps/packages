# @bota-apps/extension-sdk

## 0.2.2

### Patch Changes

- Updated dependencies [8c59a99]
  - @bota-apps/react-ui@0.6.0

## 0.2.1

### Patch Changes

- 0671cc2: Docs & metadata: add package keywords, a structured author field, and an expanded README. No runtime or API changes.
- Updated dependencies [0671cc2]
- Updated dependencies [0671cc2]
  - @bota-apps/react-ui@0.5.0

## 0.2.0

### Minor Changes

- 6cfe6e1: New package `@bota-apps/extension-sdk`: the runtime contract for embeddable extension apps. Provides the host↔iframe bridge (`isEmbedded`, `notifyHost`, `readContextFromUrl` + `AppInstallationContext`), the standalone `ExtensionShell` chrome, and `createExtensionApp` — the bootstrap factory that renders an extension bare when embedded and shell-wrapped when standalone. Replaces the copy-pasted bridge/shell/bootstrap each extension previously hand-rolled.

### Patch Changes

- Updated dependencies [6cfe6e1]
  - @bota-apps/react-ui@0.4.2
