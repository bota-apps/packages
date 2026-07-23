---
"@bota-apps/react-ui": patch
---

Left-anchor the `narrow` PageContent width variant. Narrow pages (forms,
focused flows) previously centered themselves while every other width cap
anchored to the content well's start edge — a centered slim column read as
adrift next to its left-anchored sibling pages. All width variants now share
the same rail-anchored behavior; only the `max-w-2xl` cap distinguishes
`narrow`.
