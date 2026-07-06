import { useCallback, useRef, useState } from "react";
import type { UsePrintOptions, UsePrintResult } from "./types";
import { printDocumentDefaults } from "./constants";
import { buildPrintPageStyle, waitForDocumentFonts, waitForImages } from "./utils";

const printIframeAttribute = "data-bota-print-iframe";

/** How long after print() returns before we stop waiting for afterprint/focus. */
const printSettleFallbackMs = 3000;

function removePreviousPrintIframes() {
  document.querySelectorAll(`iframe[${printIframeAttribute}]`).forEach((el) => {
    el.remove();
  });
}

async function executePrint(el: HTMLElement, options: UsePrintOptions): Promise<void> {
  const docType = options.documentType;
  const defaults = docType ? printDocumentDefaults[docType] : undefined;
  const layout = { ...defaults?.layout, ...options.layout };
  const pageStyle = buildPrintPageStyle(layout, options.pageStyle ?? defaults?.pageStyle);

  // The previous print's iframe is only cleaned up here (see the finally
  // block for why teardown is deferred).
  removePreviousPrintIframes();

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute(printIframeAttribute, "true");
  iframe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:0;height:0;border:none;";
  document.body.appendChild(iframe);
  let printed = false;

  try {
    const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Could not access iframe document");
    }

    // Build document head
    iframeDoc.open();
    iframeDoc.write("<!DOCTYPE html><html><head>");

    if (options.title) {
      iframeDoc.write(`<title>${options.title}</title>`);
    }

    if (options.copyGlobalStyles !== false) {
      const sheets = Array.from(
        document.querySelectorAll<Element>('link[rel="stylesheet"], style'),
      );
      for (const sheet of sheets) {
        iframeDoc.write(sheet.outerHTML);
      }
    }

    iframeDoc.write(`<style>${pageStyle}</style>`);
    iframeDoc.write("</head><body></body></html>");

    // Wait for iframe load before appending content. close() can complete
    // the document synchronously (jsdom, cached about:blank), in which case
    // the load event has already passed.
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframeDoc.close();
      if (iframeDoc.readyState === "complete") {
        resolve();
      }
    });

    // Clone DOM into iframe body after load
    const clone = el.cloneNode(true) as HTMLElement;
    iframeDoc.body.appendChild(clone);

    // Wait for resources
    await waitForDocumentFonts(iframeDoc);
    await waitForImages(iframeDoc);

    if (options.waitFor) {
      await options.waitFor();
    }

    // Trigger print and wait for dialog close. afterprint covers Chrome and
    // Firefox; the parent-window focus listener covers a dismissed dialog in
    // browsers whose dialog blurs the window; the timeout covers Safari,
    // whose print sheet neither fires afterprint on the iframe window nor
    // blurs the parent window — without it the promise never settles and
    // isPrinting sticks true forever.
    await new Promise<void>((resolve) => {
      const win = iframe.contentWindow;
      if (!win) {
        resolve();
        return;
      }
      let settled = false;
      const settle = () => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(fallbackTimer);
        win.removeEventListener("afterprint", settle);
        window.removeEventListener("focus", onFocus);
        resolve();
      };
      const onFocus = () => {
        // Give the browser a beat to finish spooling before settling.
        setTimeout(settle, 150);
      };
      win.addEventListener("afterprint", settle, { once: true });
      window.addEventListener("focus", onFocus, { once: true });
      // In blocking-dialog browsers print() holds the event loop, so this
      // fires right after the dialog closes; in Safari it bounds the wait.
      const fallbackTimer = setTimeout(settle, printSettleFallbackMs);
      printed = true;
      win.print();
    });
  } finally {
    // Teardown is deferred to the next print call: settling can race a
    // still-open dialog (Safari's sheet, an alt-tabbed Firefox dialog), and
    // removing the iframe at that moment would blank the spooled document.
    if (!printed && document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}

export function usePrint<T extends HTMLElement = HTMLDivElement>(
  options: UsePrintOptions = {},
): UsePrintResult<T> {
  const printRef = useRef<T>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const isPrintingRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const print = useCallback(async () => {
    const el = printRef.current;
    if (!el || isPrintingRef.current) {
      return;
    }

    const opts = optionsRef.current;
    isPrintingRef.current = true;
    setIsPrinting(true);

    try {
      if (opts.onBeforePrint) {
        await opts.onBeforePrint();
      }
      await executePrint(el, opts);
      opts.onAfterPrint?.();
    } catch (error) {
      opts.onPrintError?.(error);
    } finally {
      isPrintingRef.current = false;
      setIsPrinting(false);
    }
  }, []);

  return { printRef, print, isPrinting, canPrint: true };
}
