# @bota-apps/react-ui — Storybook example

A standalone Storybook app that **installs the published `@bota-apps/react-ui`
package from npm** and renders its components. It's a real-world smoke test:
if the published package's exports, types, Tailwind preset, and theme CSS all
work here, they'll work in any consumer app.

This app is intentionally **not** part of the library's build or workspace — it
has its own `package.json` and installs the package from the registry, exactly
as a downstream consumer would.

## What it exercises

- Main barrel import: `Button`, `Badge`, `Card`, layout primitives (`Stack`,
  `Inline`, `Grid`)
- The separate charts entry: `@bota-apps/react-ui/charts` → `LineChart`
- The Tailwind **preset** (`@bota-apps/react-ui/preset`) and **theme CSS**
  (`@bota-apps/react-ui/theme.css`), including the light/dark token toggle in
  the toolbar

## Run

```bash
cd examples/storybook
pnpm install --ignore-workspace   # pulls @bota-apps/react-ui from npm
pnpm storybook                    # dev server at http://localhost:6006
```

> `--ignore-workspace` is required: without it, pnpm walks up to the repo
> root's `pnpm-workspace.yaml` and installs the _workspace_ instead of this
> project — this folder's `node_modules` never gets created and the
> `storybook` command is not found. (This example is deliberately not a
> workspace member, so it installs from npm rather than linking the local
> packages.)

## Build (static, used for CI verification)

```bash
pnpm build-storybook   # outputs to storybook-static/
```

## Testing against a new release

Bump the `@bota-apps/react-ui` version in this folder's `package.json` (or run
`pnpm update @bota-apps/react-ui`) and re-install to validate a freshly
published version.
