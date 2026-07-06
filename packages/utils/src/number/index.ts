// Generic number formatting — one definition, imported everywhere it's needed, so
// no route or component constructs its own Intl.* formatter. Currency/Money
// formatting lives in @bota-apps/schema-utils; date formatting in ../time.
const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
