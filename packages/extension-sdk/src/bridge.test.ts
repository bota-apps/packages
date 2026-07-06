import { afterEach, describe, expect, it, vi } from "vitest";
import { isEmbedded, notifyHost, readContextFromUrl, standaloneContext } from "./bridge";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("isEmbedded", () => {
  it("is false when window.parent is window (standalone)", () => {
    expect(isEmbedded()).toBe(false);
  });

  it("is true when window.parent differs from window (embedded)", () => {
    vi.stubGlobal("window", { parent: {} });
    expect(isEmbedded()).toBe(true);
  });
});

describe("notifyHost", () => {
  it("posts the message up to the host when embedded", () => {
    const postMessage = vi.fn();
    // parent is a distinct object → embedded → post fires
    vi.stubGlobal("window", { parent: { postMessage } });
    notifyHost({ kind: "test.ready" });
    expect(postMessage).toHaveBeenCalledWith({ kind: "test.ready" }, "*");
  });

  it("is a no-op when standalone", () => {
    const postMessage = vi.fn();
    const win: Record<string, unknown> = { postMessage };
    win.parent = win; // parent === window → not embedded
    vi.stubGlobal("window", win);
    notifyHost({ kind: "test.ready" });
    expect(postMessage).not.toHaveBeenCalled();
  });
});

describe("readContextFromUrl", () => {
  it("reads tenant + token from the query string", () => {
    const ctx = readContextFromUrl("?tenantId=t1&tenantName=Acme&appToken=abc");
    expect(ctx).toEqual({ tenantId: "t1", tenantName: "Acme", appToken: "abc" });
  });

  it("falls back to the standalone context for missing params", () => {
    expect(readContextFromUrl("")).toEqual(standaloneContext);
  });
});
