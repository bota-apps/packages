import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SuspensePageContainer } from "./index";

// A component that suspends until the given promise resolves.
function makeSuspender() {
  let resolve!: () => void;
  let settled = false;
  const promise = new Promise<void>((r) => {
    resolve = () => {
      settled = true;
      r();
    };
  });
  function Suspender() {
    if (!settled) {
      throw promise;
    }
    return <p>Loaded content</p>;
  }
  return { Suspender, resolve };
}

function Thrower(): ReactNode {
  throw new Error("Query exploded");
}

describe("SuspensePageContainer", () => {
  beforeEach(() => {
    // React logs boundary-caught errors; keep test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the loading fallback while children suspend, then the content", async () => {
    const { Suspender, resolve } = makeSuspender();
    render(
      <SuspensePageContainer fallbackTitle="Projects">
        <Suspender />
      </SuspensePageContainer>,
    );

    expect(document.title).toBe("Projects");
    expect(screen.queryByText("Loaded content")).toBeNull();

    resolve();
    expect(await screen.findByText("Loaded content")).toBeTruthy();
  });

  it("renders the error fallback with the thrown message when a child throws", () => {
    render(
      <SuspensePageContainer fallbackTitle="Projects" errorTitle="Page failed">
        <Thrower />
      </SuspensePageContainer>,
    );

    expect(screen.getByText("Page failed")).toBeTruthy();
    expect(screen.getByText("Query exploded")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Try Again/ })).toBeTruthy();
  });
});
