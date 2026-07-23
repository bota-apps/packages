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

// Shaped like graphql-request's ClientError for an authorization failure.
function ForbiddenThrower(): ReactNode {
  const error = new Error(
    'Operations only.: {"response":{"errors":[{"message":"Operations only."}]}}',
  );
  Object.assign(error, {
    response: {
      status: 200,
      errors: [{ message: "Operations only.", extensions: { code: "FORBIDDEN" } }],
    },
  });
  throw error;
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

  it("renders the error fallback without echoing the raw thrown message", () => {
    render(
      <SuspensePageContainer
        fallbackTitle="Projects"
        errorTitle="Page failed"
        errorDescription="Please retry."
      >
        <Thrower />
      </SuspensePageContainer>,
    );

    expect(screen.getByText("Page failed")).toBeTruthy();
    expect(screen.getByText("Please retry.")).toBeTruthy();
    expect(screen.queryByText(/Query exploded/)).toBeNull();
    expect(screen.getByRole("button", { name: /Try Again/ })).toBeTruthy();
  });

  it("classifies authorization failures: access copy, no raw payload, no retry", () => {
    render(
      <SuspensePageContainer fallbackTitle="Projects" errorTitle="Page failed">
        <ForbiddenThrower />
      </SuspensePageContainer>,
    );

    expect(screen.getByText("You don't have access to this page")).toBeTruthy();
    expect(screen.queryByText(/response/)).toBeNull();
    expect(screen.queryByText(/Operations only/)).toBeNull();
    expect(screen.queryByRole("button", { name: /Try Again/ })).toBeNull();
  });
});
