---
"@bota-apps/react-ui": minor
---

`PhoneDisplay` is now country-agnostic — no built-in locale. The number is shown as given unless you supply formatting props.

Migration:

- Removed the `variant` prop and the `PhoneDisplayVariant` type (`"ethiopian" | "international"`), along with the hard-coded `+251` normalization/grouping.
- Added `countryCode?: string` (calling code applied to national-form input, dropping a leading trunk `0`) and `groups?: number[]` (segment lengths for the national part).
- To reproduce the previous Ethiopian default, pass `countryCode="251"` with `groups={[3, 2, 2, 2]}`; for the old `"international"` layout use `groups={[3, 3, 3]}`.
