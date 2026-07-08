---
"@bota-apps/react-ui": patch
---

Fix the DynamicForm currency field to honor its plain-number data contract. The renderer emitted a Money-shaped `{ amount, currency }` object, so any form with a currency widget failed zod validation ("must be a number") and never submitted — zodBuilder, the normalizer, and gql-codegen's widget policy all expect a plain number (SDL pattern: `<field>Amount: Float @widget(type: currency)`). Money stays display-only.
