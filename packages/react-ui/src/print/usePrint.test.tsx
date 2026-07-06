import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { usePrint } from "./usePrint";

const printIframeSelector = "iframe[data-bota-print-iframe]";

function currentIframe(): HTMLIFrameElement {
  const iframe = document.querySelector<HTMLIFrameElement>(printIframeSelector);
  if (!iframe) {
    throw new Error("print iframe missing");
  }
  return iframe;
}

function Harness({ onPrintWindow }: { onPrintWindow: (win: Window) => void }) {
  const { printRef, print, isPrinting } = usePrint<HTMLDivElement>({
    // Runs right before print() — the last hook where the test can reach the
    // iframe window and stub its print method.
    waitFor: () => {
      const win = currentIframe().contentWindow;
      if (!win) {
        throw new Error("print iframe has no window");
      }
      onPrintWindow(win);
    },
  });
  return (
    <div>
      <div ref={printRef}>printable content</div>
      <button type="button" onClick={() => void print()}>
        print
      </button>
      <output>{String(isPrinting)}</output>
    </div>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.querySelectorAll(printIframeSelector).forEach((el) => {
    el.remove();
  });
});

describe("usePrint", () => {
  it("settles via the fallback timeout when neither afterprint nor focus fires (Safari)", async () => {
    const printSpy = vi.fn();
    render(
      <Harness
        onPrintWindow={(win) => {
          win.print = printSpy;
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "print" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(printSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status").textContent).toBe("true");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    expect(screen.getByRole("status").textContent).toBe("false");
  });

  it("keeps the iframe after settling and removes it on the next print call", async () => {
    render(
      <Harness
        onPrintWindow={(win) => {
          win.print = vi.fn();
        }}
      />,
    );
    const button = screen.getByRole("button", { name: "print" });

    fireEvent.click(button);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    // Deferred teardown: a still-open dialog must keep its spooled document.
    const firstIframe = currentIframe();
    expect(document.body.contains(firstIframe)).toBe(true);

    fireEvent.click(button);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    const iframes = document.querySelectorAll(printIframeSelector);
    expect(iframes).toHaveLength(1);
    expect(iframes[0]).not.toBe(firstIframe);
  });

  it("settles immediately on afterprint without waiting for the fallback", async () => {
    let printWindow: Window | undefined;
    render(
      <Harness
        onPrintWindow={(win) => {
          printWindow = win;
          win.print = () => {
            win.dispatchEvent(new Event("afterprint"));
          };
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "print" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(printWindow).toBeDefined();
    expect(screen.getByRole("status").textContent).toBe("false");
  });
});
