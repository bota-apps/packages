import { describe, expect, it } from "vitest";
import { installJsdomShims } from "./jsdomShims";

describe("installJsdomShims", () => {
  it("installs the browser-gap shims and pins the desktop width", () => {
    installJsdomShims();

    expect(window.matchMedia("(prefers-color-scheme: dark)").matches).toBe(false);
    expect(new window.ResizeObserver(() => {}).observe).toBeTypeOf("function");
    expect(document.body.hasPointerCapture(1)).toBe(false);
    expect(() => document.body.scrollIntoView()).not.toThrow();
    expect(document.documentElement.clientWidth).toBe(1280);
  });

  it("pins a caller-chosen viewport width", () => {
    installJsdomShims({ desktopWidth: 375 });
    expect(document.documentElement.clientWidth).toBe(375);
    installJsdomShims();
    expect(document.documentElement.clientWidth).toBe(1280);
  });
});
