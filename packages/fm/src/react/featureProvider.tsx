import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { FeatureCollector, FeatureGateContext } from "@bota-apps/types/fm";
import { defaultCollectors } from "../tree/collectors";
import type { FeatureRegistry } from "../tree/registry";

type FeatureContextValue = {
  registry: FeatureRegistry;
  gateContext: FeatureGateContext;
  collectors: readonly FeatureCollector[];
};

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

/**
 * Provides the resolved feature tree plus the gating inputs to the hooks below.
 * `context` carries the app's grants (flags, permissions, plan, …) — omit it
 * and every gated node fails closed. Pass a stable (memoized) object; a new
 * identity re-resolves every consumer.
 */
export function FeatureProvider({
  registry,
  context,
  collectors = defaultCollectors,
  children,
}: {
  registry: FeatureRegistry;
  context?: FeatureGateContext;
  collectors?: readonly FeatureCollector[];
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ registry, gateContext: context ?? {}, collectors }),
    [registry, context, collectors],
  );
  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}

/** The full provider value — registry plus gating inputs (internal to fm's hooks). */
export function useFeatureContextValue(): FeatureContextValue {
  const value = useContext(FeatureContext);
  if (!value) {
    throw new Error("Feature hooks must be used within a <FeatureProvider>.");
  }
  return value;
}

export function useFeatureRegistryContext(): FeatureRegistry {
  return useFeatureContextValue().registry;
}
