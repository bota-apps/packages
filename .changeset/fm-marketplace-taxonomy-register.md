---
"@bota-apps/types": patch
"@bota-apps/fm": patch
---

Make the marketplace taxonomy app-extensible. `AppMarketplaceCategory` is no longer a closed union: it resolves to `DefaultAppMarketplaceCategory` (the unchanged platform five: `tasks | projects | compliance | reporting | integrations`) plus whatever an app registers via declaration merging on the new `FmRegister` slot — the same mechanism as `AuthRegister`:

```ts
declare module "@bota-apps/types/fm" {
  interface FmRegister {
    marketplaceCategory: "crm" | "billing";
  }
}
```

Unregistered apps see exactly the previous five members — nothing narrows or breaks. New exports from `@bota-apps/types/fm`: `DefaultAppMarketplaceCategory`, `FmRegister`, `RegisteredMarketplaceCategory<TRegister = FmRegister>`. `@bota-apps/fm` re-exports the new type names (except `FmRegister` — augmentation must target the declaring module, `"@bota-apps/types/fm"`).
