import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./useCopyToClipboard";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.assign(navigator, { clipboard: { writeText } });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  // jsdom has no navigator.clipboard by default; remove whatever a test added.
  delete (navigator as { clipboard?: unknown }).clipboard;
});

describe("useCopyToClipboard", () => {
  it("copies and resets the copied flag after 2s", async () => {
    vi.useFakeTimers();
    mockClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("hello");
    });
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeUndefined();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.copied).toBe(false);
  });

  it("surfaces clipboard rejection as error state instead of an unhandled rejection", async () => {
    mockClipboard(() => Promise.reject(new Error("denied")));
    // The legacy execCommand fallback also fails in this scenario.
    document.execCommand = () => {
      throw new Error("unsupported");
    };
    const { result } = renderHook(() => useCopyToClipboard());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.copy("hello");
    });
    expect(ok).toBe(false);
    expect(result.current.copied).toBe(false);
    expect(result.current.error?.message).toBe("denied");
  });

  it("falls back to execCommand when navigator.clipboard is unavailable", async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;
    const { result } = renderHook(() => useCopyToClipboard());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.copy("fallback text");
    });
    expect(ok).toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(result.current.copied).toBe(true);
  });

  it("clears the reset timer on unmount (no setState after unmount)", async () => {
    vi.useFakeTimers();
    mockClipboard(() => Promise.resolve());
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("hello");
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
