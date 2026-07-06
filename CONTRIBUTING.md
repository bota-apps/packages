# Contributing

## Setup

```bash
pnpm install          # Node >= 20, pnpm version pinned via packageManager
pnpm build            # tsc per package, topological via turbo
pnpm test             # vitest, all packages
pnpm --filter @bota-apps/storybook storybook   # live component playground
```

## Ground rules

All coding standards and structural conventions live in **[AGENT.md](AGENT.md)**
— camelCase everywhere, the per-component module layout (`index.tsx` +
`variants.ts` + colocated story/test), the `html/` styling layer, dependency
direction, wrap-Radix rule, app-agnosticism, and translator-injection i18n.
Read it before writing code; PRs that violate it will be rejected.

## Changesets & releases

Every user-visible change needs a changeset:

```bash
pnpm changeset        # pick packages + bump + write the note
```

While the packages are on 0.x, breaking changes are released as `minor` bumps —
say so explicitly in the changeset body with migration notes. Merging to main
opens/updates the "Version Packages" PR; merging that publishes to npm with
provenance.

## Release branches & the public Storybook

The workspace Storybook (`apps/storybook`) is deployed to GitHub Pages as the
public component showcase — but only for **external releases**, never from
`main` (which is usually ahead of what's on npm).

Release branches are cut automatically:
[release.yml](.github/workflows/release.yml) creates `releases/<version>`
(named after `@bota-apps/react-ui`, the showcase package) from the published
commit after every successful `changeset publish`, then dispatches
[deployStorybook.yml](.github/workflows/deployStorybook.yml) for it. The
deploy builds the packages + Storybook at that commit — so the public site
always renders exactly the source that was released.

Manual pushes to a `releases/*` branch also trigger a redeploy (e.g. a
story-only fix backported to a release), and the deploy workflow can be run
against any ref from the Actions tab (`workflow_dispatch`). To backfill a
branch for an older release:

```bash
git branch releases/0.3.0 <published-commit>
git push origin releases/0.3.0
```

## Build quirk: `fixExtensions.mjs`

Packages compile with `moduleResolution: Bundler`, so tsc emits extensionless
relative imports. `scripts/fixExtensions.mjs` runs after every `tsc` build and
rewrites them to fully-specified ESM paths (`./x` → `./x.js`) so Node and
`nodenext` consumers resolve correctly. If you add a build step, keep it after
this pass; if imports mysteriously fail in a consumer, check `dist/` for a
specifier this script missed.

## Commit hooks

`husky` + `lint-staged` run eslint/prettier on staged files at commit time.
CI re-checks everything (`build → typecheck → lint → test`), so hooks are a
fast-feedback convenience, not the gate.
