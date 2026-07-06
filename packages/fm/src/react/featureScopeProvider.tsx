import { createContext, useContext, type ReactNode } from "react";

// The ambient "current scope" chain (app → page → action). The root establishes
// an app scope so `useFeatureScope()` (no id) always resolves to a real scope.
const CurrentScopeIdContext = createContext<string | undefined>(undefined);

export function FeatureScopeProvider({
  featureId,
  children,
}: {
  featureId: string;
  children: ReactNode;
}) {
  return (
    <CurrentScopeIdContext.Provider value={featureId}>{children}</CurrentScopeIdContext.Provider>
  );
}

export function useCurrentScopeId(): string | undefined {
  return useContext(CurrentScopeIdContext);
}
