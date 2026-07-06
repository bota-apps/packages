import { Suspense, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { i18n } from "../instance";

type TranslationProviderProps = {
  children: ReactNode;
};

/**
 * Mounts the shared translation singleton into the React tree. The Suspense
 * boundary covers lazily loaded namespaces so a translation fetch never
 * suspends the whole app shell.
 */
export function TranslationProvider({ children }: TranslationProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={null}>{children}</Suspense>
    </I18nextProvider>
  );
}
