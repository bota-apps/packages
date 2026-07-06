import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultInitOptions } from "../instance";
import { withMissingKeyReporting } from "./index";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("withMissingKeyReporting", () => {
  it("defaults to ignore: no handler, saveMissing false, defaults preserved", () => {
    const options = withMissingKeyReporting();
    expect(options.saveMissing).toBe(false);
    expect(options.missingKeyHandler).toBeUndefined();
    // Reproduces the defaults so callers never re-list them.
    expect(options.fallbackLng).toBe(defaultInitOptions.fallbackLng);
    expect(options.nsSeparator).toBe(defaultInitOptions.nsSeparator);
  });

  it.each([
    ["error", "error"],
    ["warning", "warn"],
    ["info", "info"],
  ] as const)("level %s reports via console.%s and enables saveMissing", (level, method) => {
    const spy = vi.spyOn(console, method).mockImplementation(() => undefined);
    const options = withMissingKeyReporting({ level });

    expect(options.saveMissing).toBe(true);
    expect(typeof options.missingKeyHandler).toBe("function");

    options.missingKeyHandler?.(["am"], "projects", "fields.status", "", false, undefined);
    expect(spy).toHaveBeenCalledWith("[i18n] MISSING am projects:fields.status");
  });

  it("onMissing overrides the default reporter entirely", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const seen: string[] = [];
    const options = withMissingKeyReporting({
      level: "error",
      onMissing: (lng, ns, key) => {
        seen.push(`${lng}/${ns}/${key}`);
      },
    });

    options.missingKeyHandler?.(["am"], "projects", "fields.status", "", false, undefined);

    expect(seen).toEqual(["am/projects/fields.status"]);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("never throws when the reporter is invoked", () => {
    const options = withMissingKeyReporting({ level: "warning" });
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(() =>
      options.missingKeyHandler?.(["en"], "common", "save", "", false, undefined),
    ).not.toThrow();
  });
});
