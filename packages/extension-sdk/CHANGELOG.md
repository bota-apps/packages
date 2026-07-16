# @bota-apps/extension-sdk

## 0.2.9

### Patch Changes

- Updated dependencies [d2ae36c]
- Updated dependencies [4ca7727]
  - @bota-apps/react-ui@0.13.0

## 0.2.8

### Patch Changes

- Updated dependencies [ab5fed8]
- Updated dependencies [b32b034]
- Updated dependencies [17efd87]
  - @bota-apps/react-ui@0.12.0

## 0.2.7

### Patch Changes

- Updated dependencies [1df93c4]
- Updated dependencies [1df93c4]
  - @bota-apps/react-ui@0.11.0

## 0.2.6

### Patch Changes

- Updated dependencies [d64ff10]
  - @bota-apps/react-ui@0.10.0

## 0.2.5

### Patch Changes

- Updated dependencies [888d537]
- Updated dependencies [fd74d2e]
  - @bota-apps/react-ui@0.9.0

## 0.2.4

### Patch Changes

- Updated dependencies [5ff7de0]
  - @bota-apps/react-ui@0.8.0

## 0.2.3

### Patch Changes

- 38fd879: The standalone fallback install context now uses a neutral `tenantName` (`"Demo Organization"`).
- Updated dependencies [38fd879]
  - @bota-apps/react-ui@0.7.0

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
