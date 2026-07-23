import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { Button } from "@bota-apps/react-ui";
import { classifyPageError, isRetryablePageError, PageErrorProvider } from "./pageError";
import { PageContainer } from "./pageContainer";

afterEach(cleanup);

function clientError(code: string, message = "Denied") {
  const error = new Error(`${message}: {"response":{"errors":[]}}`);
  Object.assign(error, {
    response: { status: 200, errors: [{ message, extensions: { code } }] },
  });
  return error;
}

function httpError(status: number) {
  const error = new Error(`GraphQL Error (Code: ${status}): {"response":{}}`);
  Object.assign(error, { response: { status, errors: undefined } });
  return error;
}

describe("classifyPageError", () => {
  it("maps GraphQL extension codes to page error codes", () => {
    expect(classifyPageError(clientError("FORBIDDEN")).code).toBe("forbidden");
    expect(classifyPageError(clientError("UNAUTHENTICATED")).code).toBe("unauthenticated");
    expect(classifyPageError(clientError("NOT_FOUND")).code).toBe("not-found");
    expect(classifyPageError(clientError("INTERNAL_SERVER_ERROR")).code).toBe("server");
    expect(classifyPageError(clientError("SOMETHING_ELSE")).code).toBe("unknown");
  });

  it("maps HTTP statuses to page error codes", () => {
    expect(classifyPageError(httpError(401)).code).toBe("unauthenticated");
    expect(classifyPageError(httpError(403)).code).toBe("forbidden");
    expect(classifyPageError(httpError(404)).code).toBe("not-found");
    expect(classifyPageError(httpError(503)).code).toBe("server");
  });

  it("maps fetch failures to network and plain errors to unknown", () => {
    expect(classifyPageError(new TypeError("Failed to fetch")).code).toBe("network");
    expect(classifyPageError(new Error("boom")).code).toBe("unknown");
  });

  it("keeps the full technical message in detail, never as a safe message", () => {
    const page = classifyPageError(clientError("FORBIDDEN", "Operations only."));
    expect(page.detail).toContain("response");
    expect(page.safeMessage).toBeUndefined();
  });

  it("marks only network/server/unknown as retryable", () => {
    expect(isRetryablePageError("network")).toBe(true);
    expect(isRetryablePageError("server")).toBe(true);
    expect(isRetryablePageError("unknown")).toBe(true);
    expect(isRetryablePageError("forbidden")).toBe(false);
    expect(isRetryablePageError("unauthenticated")).toBe(false);
    expect(isRetryablePageError("not-found")).toBe(false);
  });
});

describe("PageErrorProvider + PageContainer", () => {
  it("suppresses retry for non-retryable codes even when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<PageContainer title="Doc" state={{ kind: "error", code: "forbidden", onRetry }} />);
    expect(screen.getByText("You don't have access to this page")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Try Again/ })).toBeNull();
  });

  it("renders app-level actions and localized copy from the provider", () => {
    const renderActions = vi.fn(({ code, detail }) => (
      <Button>{`Report ${code} ${detail ?? ""}`.trim()}</Button>
    ));
    render(
      <PageErrorProvider
        renderActions={renderActions}
        copy={{ forbidden: { title: "No access here", description: "Ask an admin." } }}
      >
        <PageContainer
          title="Doc"
          state={{ kind: "error", code: "forbidden", detail: "code=FORBIDDEN" }}
        />
      </PageErrorProvider>,
    );
    expect(screen.getByText("No access here")).toBeTruthy();
    expect(screen.getByText("Ask an admin.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Report forbidden code=FORBIDDEN" })).toBeTruthy();
    expect(renderActions).toHaveBeenCalledWith({ code: "forbidden", detail: "code=FORBIDDEN" });
  });

  it("keeps retry for retryable codes", () => {
    const onRetry = vi.fn();
    render(<PageContainer title="Doc" state={{ kind: "error", code: "network", onRetry }} />);
    expect(screen.getByText("Connection problem")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Try Again/ })).toBeTruthy();
  });
});
