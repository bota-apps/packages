# @bota-apps/react-ui

Context-free React UI building blocks — 70+ Tailwind + Radix primitives, a
schema-driven `DynamicForm`/`DynamicDetail`, theme-aware charts, layout
primitives, and the design tokens that style them. No data fetching, auth, or app
context — drop it into any React + Tailwind project. (Auth/data/feature wiring
lives in [`@bota-apps/react-components`](../react-components).)

## Install

```bash
pnpm add @bota-apps/react-ui
# peers: react, react-dom, tailwindcss@^3.4
```

`react`, `react-dom`, and `tailwindcss` are peer dependencies.

## Wire up Tailwind

The components render Tailwind utility classes against CSS variables, so the
preset and the theme CSS must both be present. These subpaths re-export
[`@bota-apps/tailwind-preset`](../tailwind-preset), so react-ui is the only
dependency you need.

`tailwind.config.js`:

```js
import preset from "@bota-apps/react-ui/preset";

export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // Scan the compiled package so its utility classes survive purge:
    "./node_modules/@bota-apps/react-ui/dist/**/*.js",
  ],
};
```

Your global stylesheet (defines the light + dark CSS variables and pulls in the
`@tailwind` layers):

```css
@import "@bota-apps/react-ui/theme.css";
```

A ready-made PostCSS config is also exported:

```js
// postcss.config.js
export { default } from "@bota-apps/react-ui/postcss";
```

## Usage

### Primitives

Everything on the main entry is a context-free primitive — styled with Tailwind,
Radix under the hood for the interactive ones, and consumers style via `cva`
variants (never `className` overrides):

```tsx
import { Button, Card, Stack, Badge } from "@bota-apps/react-ui";

export function Example() {
  return (
    <Card title="Hello">
      <Stack gap="md">
        <Badge variant="success">Active</Badge>
        <Button>Click me</Button>
      </Stack>
    </Card>
  );
}
```

Every component exposes a matching `<name>Variants` cva (e.g. `buttonVariants`,
`badgeVariants`) plus `VariantProps`-derived unions (e.g. `BadgeVariant`) so apps
can build typed status → variant maps without reaching for `className`.

### Data table

`DataTable` wraps `@tanstack/react-table` with sorting, pagination, selection,
row actions, a toolbar, and a responsive card layout on small screens:

```tsx
import { DataTable, type ColumnDef } from "@bota-apps/react-ui";

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

<DataTable data={users} columns={columns} />;
```

### Schema-driven form & detail

`DynamicForm` renders a whole form from a registration schema (React Hook Form +
a Zod resolver built from the schema), and `DynamicDetail` renders the read view
from a detail schema. Schemas come from [`@bota-apps/types`](../types); their Zod
runtime and formatters come from [`@bota-apps/schema-utils`](../schema-utils):

```tsx
import { DynamicForm, DynamicDetail } from "@bota-apps/react-ui";

<DynamicForm
  schema={userFormSchema}
  onSubmit={(values) => save(values)}
  layout="tabs" // "default" | "tabs" | "inline"
  submitLabel="Save"
/>;

<DynamicDetail schema={userDetailSchema} data={user} columns={2} />;
```

### Charts

Charts are a separate entry point to keep `recharts` out of the main bundle.
They are theme-aware (they read the `--chart-1..8` tokens) and driven by a series
config:

```tsx
import { LineChart, chartColorByIndex } from "@bota-apps/react-ui/charts";

<LineChart
  data={data}
  categoryKey="month"
  series={[{ dataKey: "revenue", label: "Revenue" }]}
  title="Revenue"
/>;
```

### Low-level form integration (`./form`)

The React Hook Form field primitives (`Form`, `FormField`, `FormItem`,
`FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`)
ship on a dedicated subpath. They are omitted from the main barrel to avoid a
`FormField` naming collision with the `formLayout` helper — import them directly
when building a form by hand instead of via `DynamicForm`:

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl } from "@bota-apps/react-ui/form";
```

## Subpaths

| Import                          | What                                                                                                                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@bota-apps/react-ui`           | All context-free primitives — buttons, inputs, `Card`, `Badge`, `DataTable`, `DynamicForm`/`DynamicDetail`, layout (`Stack`/`Inline`/`Grid`), typography, `AppShell`, toasts, and the `html/` styling layer |
| `@bota-apps/react-ui/charts`    | Theme-aware Recharts wrappers (`LineChart`, `BarChart`, `AreaChart`, `PieChart`, `ChartLegend`) + chart color/format helpers                                                                                |
| `@bota-apps/react-ui/form`      | Low-level React Hook Form field primitives (`Form`, `FormField`, `FormItem`, …)                                                                                                                             |
| `@bota-apps/react-ui/preset`    | Tailwind preset (re-exports `@bota-apps/tailwind-preset/preset`)                                                                                                                                            |
| `@bota-apps/react-ui/postcss`   | Ready-made PostCSS config (re-exports `@bota-apps/tailwind-preset/postcss`)                                                                                                                                 |
| `@bota-apps/react-ui/theme.css` | CSS variables for light + dark, plus the `@tailwind` layers (re-exports `@bota-apps/tailwind-preset/theme.css`)                                                                                             |

Schema/`Money` **types** come from [`@bota-apps/types`](../types) and their Zod
**runtime/formatters** from [`@bota-apps/schema-utils`](../schema-utils) — react-ui
consumes them, it does not re-export them.

## Example consumer

The repo's [`examples/storybook`](https://github.com/bota-apps/packages/tree/main/examples/storybook)
installs the **published** package from npm and renders its components — a real
consumer smoke test (exports, types, Tailwind preset, theme CSS, light/dark).

Part of the [`@bota-apps` packages monorepo](https://github.com/bota-apps/packages).
