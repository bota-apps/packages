# Security Policy

## Supported versions

Only the latest published version of each `@bota-apps/*` package receives
security fixes.

## Reporting a vulnerability

Please do **not** open a public issue for security reports. Email
**musema.hassen@gmail.com** with the package name, affected version, and a
reproduction. You will get an acknowledgement within a few business days;
fixes are published as patch releases with a changeset describing the impact.

## Supply-chain notes

- Releases are published to npm from CI with **provenance** enabled — verify
  with `npm audit signatures` / the npm provenance badge.
- Dependency updates are automated via Renovate and always pass the full
  CI gate (build, typecheck, lint, tests, Storybook build, publint/attw)
  before merging.
