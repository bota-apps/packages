# @bota-apps/extension-sdk

## 0.2.0

### Minor Changes

- 6cfe6e1: New package `@bota-apps/extension-sdk`: the runtime contract for embeddable extension apps. Provides the host↔iframe bridge (`isEmbedded`, `notifyHost`, `readContextFromUrl` + `AppInstallationContext`), the standalone `ExtensionShell` chrome, and `createExtensionApp` — the bootstrap factory that renders an extension bare when embedded and shell-wrapped when standalone. Replaces the copy-pasted bridge/shell/bootstrap each extension previously hand-rolled.

### Patch Changes

- Updated dependencies [6cfe6e1]
  - @bota-apps/react-ui@0.4.2
