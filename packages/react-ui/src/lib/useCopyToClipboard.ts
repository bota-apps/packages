import { useState, useCallback, useEffect, useRef } from "react";

/** Fallback for insecure contexts (plain http), where navigator.clipboard is undefined. */
function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string) => {
    const onCopied = () => {
      setCopied(true);
      setError(undefined);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    };

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        onCopied();
        return true;
      }
      if (legacyCopy(text)) {
        onCopied();
        return true;
      }
      setError(new Error("Clipboard is not available"));
      return false;
    } catch (err) {
      // Permission denied or clipboard blocked — surface instead of rejecting unhandled.
      if (legacyCopy(text)) {
        onCopied();
        return true;
      }
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }, []);

  return { copied, copy, error };
}
