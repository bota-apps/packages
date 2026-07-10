---
"@bota-apps/react-ui": patch
---

Add document-row chrome (print-fidelity, statement/invoice/report-style artifacts) so consumers can drop the remaining raw-`className` escape hatches:

- **Inline**: `background` gains `primary` (`bg-primary/10`) and `primarySubtle` (`bg-primary/5`) tints; new `borderTop` boolean (`border-t`); `paddingX` gains `xl` (`px-8`); `paddingY` gains `xl` (`py-5`); `indent` gains `xl` (`pl-12` — indent values pair with the same-named `paddingX`, they are not an absolute scale); new `accent` boolean — a left accent bar (`border-l-[3px] border-l-primary`) for document/section headers.
- **Div**: `background` gains the same `primary`/`primarySubtle` tints; `border` gains `bPrimary` (`border-b border-primary/20`) and `bPrimarySubtle` (`border-b border-primary/10`) tinted bottom borders; new split padding scales `paddingX` (`xs`–`xl`, `px-1`–`px-8`) and `paddingY` (`xs`–`xl`, `py-1`–`py-8`) alongside the all-sides `padding`.
- **DotLeader** (new primitive, exported from the package root): a dotted leader line for label……value rows — drop it between the label and the value inside an `Inline` row; it grows to fill the gap (`flex-1 border-b border-dotted border-border/50 mx-3`, nudged up to the text baseline) and is `aria-hidden`. `dotLeaderVariants` is exported alongside it.

All additive and optional; no existing API changes.
