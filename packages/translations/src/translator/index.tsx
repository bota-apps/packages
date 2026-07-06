import { createContext, useContext, type ReactNode } from "react";
import type { TFunction, Namespace } from "i18next";

const ScopedTranslatorContext = createContext<TFunction<Namespace> | undefined>(undefined);

type ScopedTranslatorProviderProps = {
  value: TFunction<Namespace>;
  children: ReactNode;
};

/**
 * Provides a pre-bound translator to descendants so deep layout components can
 * translate keys at render time without prop-drilling the function through
 * layers that don't otherwise care. Distinct from `TranslationProvider` (which
 * mounts the singleton): this only shares an already-bound `t`. Typical use is
 * a scoped namespace (e.g. an app's "nav" namespace holding breadcrumb and
 * sidebar labels): pass `i18n.getFixedT(null, ns)` as `value` and read it with
 * `useScopedTranslator()`.
 */
export function ScopedTranslatorProvider({ value, children }: ScopedTranslatorProviderProps) {
  return (
    <ScopedTranslatorContext.Provider value={value}>{children}</ScopedTranslatorContext.Provider>
  );
}

export function useScopedTranslator(): TFunction<Namespace> | undefined {
  return useContext(ScopedTranslatorContext);
}
