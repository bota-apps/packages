import { describe, expect, it } from "vitest";
import { derivePageState } from "./derivePageState";

const empty = { title: "No projects", description: "Add your first project." };

describe("derivePageState", () => {
  it("is loading while fetching with no cached data", () => {
    const state = derivePageState({ isLoading: true, isError: false, data: undefined }, empty);
    expect(state).toEqual({ kind: "loading" });
  });

  it("is error when the request failed with no cached data", () => {
    const state = derivePageState({ isLoading: false, isError: true, data: undefined }, empty);
    expect(state).toEqual({ kind: "error" });
  });

  it("is empty with the provided config when data is an empty list", () => {
    const state = derivePageState({ isLoading: false, isError: false, data: [] }, empty);
    expect(state).toEqual({ kind: "empty", ...empty });
  });

  it("is ready with a stale warning when the refresh failed but cached data exists", () => {
    const state = derivePageState(
      { isLoading: false, isError: true, data: [1] },
      empty,
      "Stale data shown.",
    );
    expect(state).toEqual({ kind: "ready", warning: "Stale data shown." });
  });

  it("is plain ready with data and no error", () => {
    const state = derivePageState({ isLoading: false, isError: false, data: [1, 2] }, empty);
    expect(state).toEqual({ kind: "ready" });
  });
});
