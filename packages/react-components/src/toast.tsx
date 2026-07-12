import { useSyncExternalStore } from "react";
import { cn } from "@bota-apps/react-ui";

export type ToastVariant = "success" | "error" | "info";
export type Toast = { id: string; title: string; description?: string; variant: ToastVariant };

// A framework-agnostic toast store. It lives outside React so non-component code
// (e.g. the feature runtime's `notify` adapter wired in app providers) can raise
// toasts without a hook.
let toasts: Toast[] = [];
const listeners = new Set<() => void>();
let sequence = 0;

function emit() {
  listeners.forEach((listener) => listener());
}

export function toast(input: {
  title: string;
  description?: string;
  variant?: ToastVariant;
}): string {
  const id = `toast-${++sequence}`;
  toasts = [...toasts, { id, variant: "info", ...input }];
  emit();
  setTimeout(() => dismissToast(id), 5000);
  return id;
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => toasts,
  );
}

const variantClass: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-slate-200 bg-white text-slate-800",
};

/** Mount once near the app root to render queued toasts. */
export function Toasts() {
  const items = useToasts();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className={cn(
            "rounded-lg border px-4 py-3 text-left text-sm shadow-floating",
            variantClass[t.variant],
          )}
        >
          <div className="font-medium">{t.title}</div>
          {t.description ? <div className="mt-0.5 text-xs opacity-80">{t.description}</div> : null}
        </button>
      ))}
    </div>
  );
}
