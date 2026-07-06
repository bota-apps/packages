import { describe, expect, it } from "vitest";
import { buildSubdomainUrl, getSubdomain } from "./index";

const baseDomains = ["example.com", "localhost"];

describe("getSubdomain", () => {
  it("extracts the subdomain from a production hostname", () => {
    expect(getSubdomain(baseDomains, "acme.example.com")).toBe("acme");
  });

  it("extracts the subdomain from a local dev hostname", () => {
    expect(getSubdomain(baseDomains, "acme.localhost")).toBe("acme");
  });

  it("supports multi-label subdomains", () => {
    expect(getSubdomain(baseDomains, "acme.staging.example.com")).toBe("acme.staging");
  });

  it("throws when the hostname is the bare base domain (no subdomain)", () => {
    expect(() => getSubdomain(baseDomains, "example.com")).toThrow(/No tenant subdomain/);
    expect(() => getSubdomain(baseDomains, "localhost")).toThrow(/No tenant subdomain/);
  });

  it("throws when the hostname is not under an allowed domain", () => {
    expect(() => getSubdomain(baseDomains, "acme.other.dev")).toThrow(
      /not under an allowed domain/,
    );
  });

  it("throws on an empty hostname", () => {
    expect(() => getSubdomain(baseDomains, "")).toThrow(/No hostname provided/);
  });
});

describe("buildSubdomainUrl", () => {
  it("builds a production URL, stripping the current subdomain", () => {
    const location = { protocol: "https:", hostname: "old.example.com", port: "" };
    expect(buildSubdomainUrl("acme", baseDomains, "/", location)).toBe("https://acme.example.com/");
  });

  it("preserves a non-standard port on local dev", () => {
    const location = { protocol: "http:", hostname: "old.localhost", port: "3001" };
    expect(buildSubdomainUrl("acme", baseDomains, "/app", location)).toBe(
      "http://acme.localhost:3001/app",
    );
  });

  it("omits default ports", () => {
    const location = { protocol: "https:", hostname: "old.example.com", port: "443" };
    expect(buildSubdomainUrl("acme", baseDomains, "/", location)).toBe("https://acme.example.com/");
  });

  it("handles the bare base domain (no current subdomain)", () => {
    const location = { protocol: "http:", hostname: "localhost", port: "3001" };
    expect(buildSubdomainUrl("acme", baseDomains, "/", location)).toBe(
      "http://acme.localhost:3001/",
    );
  });

  it("falls back to the current hostname when it is outside the allowlist", () => {
    const location = { protocol: "https:", hostname: "preview.pages.dev", port: "" };
    expect(buildSubdomainUrl("acme", baseDomains, "/", location)).toBe(
      "https://acme.preview.pages.dev/",
    );
  });
});
