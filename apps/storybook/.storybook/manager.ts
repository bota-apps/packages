import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// Brand the manager chrome (sidebar title links to the repo) in both color
// schemes. Storybook's manager follows the OS preference only when no theme
// is set, so setting a branded theme means picking the base ourselves —
// match the system preference at load.
const brand = {
  brandTitle: "Bota Apps UI",
  brandUrl: "https://github.com/bota-apps/packages",
  brandTarget: "_self",
} as const;

addons.setConfig({
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? create({ base: "dark", ...brand })
    : create({ base: "light", ...brand }),
});
