# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

To record a change for release, run:

```bash
pnpm changeset
```

Pick the affected packages and a semver bump; a markdown file lands here. On
merge to `main`, the release workflow opens (or updates) a **Version Packages**
PR; merging that PR publishes the bumped packages to npm.
