import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import type { RenderResult } from "@testing-library/react";
import { createRouteSmoke } from "./createRouteSmoke";

// A stub renderRoute that paints each path's terminal surface directly — the
// engine's decision logic (which surface means pass/fail) is what's under test,
// not an app.
const shell = <p>signed in as Test User</p>;
const error = <p>Something went wrong</p>;
const notFound = <p>404 — Not Found</p>;

const surfaces: Record<string, ReactNode> = {
  "/ok": shell,
  "/crash": (
    <>
      {shell}
      {error}
    </>
  ),
  "/typo": notFound,
  "/gated": (
    <>
      {shell}
      {notFound}
    </>
  ),
  "/gateOpened": shell,
  "/hung": <p>still loading…</p>,
};

function renderSurface(path: string): RenderResult {
  return render(<div>{surfaces[path]}</div>);
}

const { expectRouteRenders, describeRouteSmoke } = createRouteSmoke({
  renderRoute: renderSurface,
  catalog: { smoke: ["/ok", "/gated"] },
  gatedRoutePaths: new Set(["/gated", "/gateOpened"]),
  shellCopy: /signed in as Test User/i,
  timeout: 500,
});

// The engine registers real describe/it blocks — run it against the stub
// catalog so the data-driven path executes inside the real runner.
describeRouteSmoke("smoke");

describe("expectRouteRenders", () => {
  it("passes a route that renders inside the shell", async () => {
    await expectRouteRenders("/ok");
  });

  it("fails a route that surfaces the error copy", async () => {
    await expect(expectRouteRenders("/crash")).rejects.toThrow(/error surface/);
  });

  it("fails a route that lands on the 404 page", async () => {
    await expect(expectRouteRenders("/typo")).rejects.toThrow(/404/);
  });

  it("asserts the gate for a flag-gated path", async () => {
    await expectRouteRenders("/gated");
  });

  it("fails a gated path whose gate did not render (flag flipped on)", async () => {
    await expect(expectRouteRenders("/gateOpened")).rejects.toThrow(/gate did not render/);
  });

  it("fails a route that never reaches a terminal surface", async () => {
    await expect(expectRouteRenders("/hung")).rejects.toThrow(/no recognizable surface/);
  });
});
