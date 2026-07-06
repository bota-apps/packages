import type { InitOptions } from "i18next";
import { defaultInitOptions } from "../instance";

// Builds InitOptions that reproduce `defaultInitOptions` and, at any level other
// than "ignore", attach missing-key reporting. Named after what it does, not the
// environment: the caller supplies the severity as a policy value — this helper
// never reads `import.meta.env` / `process.env` and never throws on its own.
//
// i18next only fires `missingKeyHandler` when `saveMissing` is on, so every
// non-ignore level sets `saveMissing: true`.

export type MissingKeyLevel = "error" | "warning" | "info" | "ignore";

type MissingKeyReporter = (lng: string, ns: string, key: string) => void;

function consoleReporter(level: Exclude<MissingKeyLevel, "ignore">): MissingKeyReporter {
  return (lng, ns, key) => {
    const message = `[i18n] MISSING ${lng} ${ns}:${key}`;
    // Loud, greppable reporting is this helper's whole job — console is intentional.
    /* eslint-disable no-console */
    if (level === "error") {
      console.error(message);
    } else if (level === "warning") {
      console.warn(message);
    } else {
      console.info(message);
    }
    /* eslint-enable no-console */
  };
}

export function withMissingKeyReporting(opts?: {
  level?: MissingKeyLevel;
  onMissing?: MissingKeyReporter;
}): InitOptions {
  const level = opts?.level ?? "ignore";

  if (level === "ignore") {
    return { ...defaultInitOptions, saveMissing: false };
  }

  const report = opts?.onMissing ?? consoleReporter(level);

  return {
    ...defaultInitOptions,
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key) => {
      const lng = Array.isArray(lngs) ? (lngs[0] ?? "") : lngs;
      report(lng, ns, key);
    },
  };
}
