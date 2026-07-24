import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import { customColorTokenNames, customColorTokens, isHexColor } from "./appearanceColor";
import { appShellLayoutKinds, type AppShellLayoutKind } from "./appShellLayout";

// App-agnostic appearance provider. Apps configure PRESETS — pre-assembled
// looks bundling every appearance axis — so one selection restyles the whole
// app; the axes stay available underneath for granular controls:
//   brand   — which token set renders (color, radius, typefaces), applied as
//             `data-brand` on <html> (what @bota-apps/tailwind-preset's
//             brands/*.css blocks key on)
//   layout  — which AppShellLayout arrangement renders (no DOM effect;
//             AppShell reads it from context)
//   density — comfortable/compact, applied as `data-density` on <html> (the
//             preset CSS scales the root font-size, which compacts every
//             rem-based utility uniformly)
//   mode    — light/dark, applied as the `.dark` class on <html>. Deliberately
//             NOT part of presets: every look ships both modes and the choice
//             stays personal, like a language.
// The whole preference persists as one object. One implementation for every
// app — no per-app appearance logic.

export type AppearanceMode = "light" | "dark";

/** UI density steps the tailwind-preset theme CSS ships root-font-size rules for. */
export const appearanceDensities = ["comfortable", "compact"] as const;
export type AppearanceDensity = (typeof appearanceDensities)[number];

/**
 * A pre-assembled look. Omitted axes resolve to the provider defaults, so
 * applying a preset always lands on the same complete appearance.
 */
export type AppearancePreset = {
  /** Stable identifier (what PresetSelect reports). */
  value: string;
  /** Display name shown by PresetSelect. */
  label: string;
  /** Menu glyph hinting at the look's character. */
  icon?: LucideIcon;
  /** One-line hint of what the look changes, shown under the label. */
  description?: string;
  /**
   * Representative color swatches (any CSS color values, e.g. the look's
   * chrome/primary/accent) — pickers with room to spare render them as a
   * visual hint of the look; compact pickers may ignore them.
   */
  preview?: readonly string[];
  /** `data-brand` token set (a brands/*.css block or the app's own). */
  brand?: string;
  layout?: AppShellLayoutKind;
  density?: AppearanceDensity;
};

/** The default-token look — theme.css's :root block, shipped by every app. */
const defaultPresets: readonly AppearancePreset[] = [{ value: "bota", label: "Bota" }];

type AppearanceState = {
  mode: AppearanceMode;
  brand: string;
  layout: AppShellLayoutKind;
  density: AppearanceDensity;
  /** Six-digit hex overriding the active brand's primary/chrome, or null. */
  customColor: string | null;
};

/**
 * The axes a caller may hydrate from an external store (e.g. server-side
 * user preferences). Every axis is optional and re-validated on the way in.
 */
export type AppearanceSnapshot = Partial<AppearanceState>;

type AppearanceContextValue = AppearanceState & {
  toggleMode: () => void;
  /** Pre-assembled looks the app offers — what PresetSelect lists. */
  presets: readonly AppearancePreset[];
  /** The preset matching the current axes, or undefined for a custom mix. */
  preset: string | undefined;
  /** Switch every appearance axis (except mode) to the named preset. */
  applyPreset: (value: string) => void;
  setBrand: (brand: string) => void;
  setLayout: (layout: AppShellLayoutKind) => void;
  /** Cycle to the next shell layout — the one-click layout flip. */
  toggleLayout: () => void;
  setDensity: (density: AppearanceDensity) => void;
  /** Cycle to the next density step — the one-click density flip. */
  toggleDensity: () => void;
  /**
   * Tint the active look with a picked color (six-digit hex) — the primary
   * ramp and shell chrome re-derive from it in both modes, on top of the
   * active brand. null returns to the brand's own colors.
   */
  setCustomColor: (color: string | null) => void;
  /**
   * Merge externally stored axes (each individually validated; invalid or
   * unknown values are ignored) — how an app applies server-side preferences
   * over the local state.
   */
  hydrateAppearance: (snapshot: AppearanceSnapshot) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined);

/** Per-app appearance setup, threaded through createAppRoot. */
export type AppearanceConfig = {
  /** Mode used before a stored choice exists (and during SSR). */
  defaultMode?: AppearanceMode;
  /** Pre-assembled looks the app ships token CSS for; single-look apps omit this. */
  presets?: readonly AppearancePreset[];
  /** Preset applied before a stored choice exists — defaults to the first preset. */
  defaultPreset?: string;
  /** `data-brand` used when a preset omits `brand` (the app's default token set). */
  defaultBrand?: string;
  /** Shell layout used when a preset omits `layout`. */
  defaultLayout?: AppShellLayoutKind;
  /** UI density used when a preset omits `density`. */
  defaultDensity?: AppearanceDensity;
  /** localStorage key the preference object persists under. */
  storageKey?: string;
};

type AppearanceProviderProps = AppearanceConfig & { children: ReactNode };

function isAppShellLayoutKind(value: unknown): value is AppShellLayoutKind {
  return appShellLayoutKinds.some((kind) => kind === value);
}

function isAppearanceDensity(value: unknown): value is AppearanceDensity {
  return appearanceDensities.some((density) => density === value);
}

function getInitialAppearance(
  storageKey: string,
  defaults: AppearanceState,
  knownBrands: readonly string[],
): AppearanceState {
  // SSR-safe: no window/localStorage on the server; hydrate with the defaults
  // and let the effect below apply the persisted choice.
  if (typeof window === "undefined") {
    return defaults;
  }
  const state = { ...defaults };
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    state.mode = "dark";
  }
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (typeof stored !== "object" || stored === null) {
      return state;
    }
    // Stored values can predate the app's current presets — keep each axis
    // only while it is still offered, never trust it wholesale.
    const mode: unknown = "mode" in stored ? stored.mode : undefined;
    const brand: unknown = "brand" in stored ? stored.brand : undefined;
    const layout: unknown = "layout" in stored ? stored.layout : undefined;
    const density: unknown = "density" in stored ? stored.density : undefined;
    const customColor: unknown = "customColor" in stored ? stored.customColor : undefined;
    if (mode === "light" || mode === "dark") {
      state.mode = mode;
    }
    const storedBrand = knownBrands.find((known) => known === brand);
    if (storedBrand) {
      state.brand = storedBrand;
    }
    if (isAppShellLayoutKind(layout)) {
      state.layout = layout;
    }
    if (isAppearanceDensity(density)) {
      state.density = density;
    }
    if (isHexColor(customColor)) {
      state.customColor = customColor;
    }
  } catch {
    // localStorage can throw (privacy mode, blocked storage) — fall through.
  }
  return state;
}

export function AppearanceProvider({
  children,
  defaultMode = "light",
  presets = defaultPresets,
  defaultPreset = presets[0]?.value,
  defaultBrand = "bota",
  defaultLayout = "sidebar",
  defaultDensity = "comfortable",
  storageKey = "appearance",
}: AppearanceProviderProps) {
  // Omitted preset axes resolve against the provider defaults, so a preset is
  // always a complete, reproducible look.
  const resolvePreset = useCallback(
    (preset: AppearancePreset) => ({
      brand: preset.brand ?? defaultBrand,
      layout: preset.layout ?? defaultLayout,
      density: preset.density ?? defaultDensity,
    }),
    [defaultBrand, defaultLayout, defaultDensity],
  );
  // Every brand any preset resolves to — the valid set for stored/granular changes.
  const knownBrands = useMemo(
    () => [...new Set([defaultBrand, ...presets.map((preset) => preset.brand ?? defaultBrand)])],
    [presets, defaultBrand],
  );

  const initialPreset = presets.find((preset) => preset.value === defaultPreset);
  if (!initialPreset) {
    throw new Error(`defaultPreset "${defaultPreset}" is not in the AppearanceProvider presets`);
  }
  const [appearance, setAppearance] = useState<AppearanceState>(() =>
    getInitialAppearance(
      storageKey,
      { mode: defaultMode, customColor: null, ...resolvePreset(initialPreset) },
      knownBrands,
    ),
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", appearance.mode === "dark");
    root.dataset.brand = appearance.brand;
    root.dataset.density = appearance.density;
    // The custom color layers inline token overrides over the brand CSS
    // (inline styles out-specify any stylesheet); clearing it must remove
    // every property it may have set, in either mode.
    if (appearance.customColor) {
      const tokens = customColorTokens(appearance.customColor, appearance.mode);
      for (const name of customColorTokenNames) {
        const value = tokens[name];
        if (value !== undefined) {
          root.style.setProperty(name, value);
        } else {
          root.style.removeProperty(name);
        }
      }
    } else {
      for (const name of customColorTokenNames) {
        root.style.removeProperty(name);
      }
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(appearance));
    } catch {
      // Persisting is best-effort; the in-memory appearance still applies.
    }
  }, [appearance, storageKey]);

  const toggleMode = useCallback(() => {
    setAppearance((current) => ({
      ...current,
      mode: current.mode === "dark" ? "light" : "dark",
    }));
  }, []);

  const applyPreset = useCallback(
    (value: string) => {
      const preset = presets.find((candidate) => candidate.value === value);
      if (!preset) {
        throw new Error(`Unknown preset "${value}" — not in the AppearanceProvider presets`);
      }
      // Picking a preset re-baselines the look — a lingering custom color
      // would repaint the fresh preset in the old tint.
      setAppearance((current) => ({
        mode: current.mode,
        customColor: null,
        ...resolvePreset(preset),
      }));
    },
    [presets, resolvePreset],
  );

  const setCustomColor = useCallback((color: string | null) => {
    if (color !== null && !isHexColor(color)) {
      throw new Error(`Custom color must be a six-digit hex value like "#2563EB", got "${color}"`);
    }
    setAppearance((current) => ({ ...current, customColor: color }));
  }, []);

  const hydrateAppearance = useCallback(
    (snapshot: AppearanceSnapshot) => {
      setAppearance((current) => {
        const next = { ...current };
        if (snapshot.mode === "light" || snapshot.mode === "dark") {
          next.mode = snapshot.mode;
        }
        if (typeof snapshot.brand === "string" && knownBrands.includes(snapshot.brand)) {
          next.brand = snapshot.brand;
        }
        if (isAppShellLayoutKind(snapshot.layout)) {
          next.layout = snapshot.layout;
        }
        if (isAppearanceDensity(snapshot.density)) {
          next.density = snapshot.density;
        }
        if (snapshot.customColor === null || isHexColor(snapshot.customColor)) {
          next.customColor = snapshot.customColor ?? null;
        }
        return next;
      });
    },
    [knownBrands],
  );

  const setBrand = useCallback(
    (brand: string) => {
      if (!knownBrands.includes(brand)) {
        throw new Error(`Unknown brand "${brand}" — no AppearanceProvider preset resolves to it`);
      }
      setAppearance((current) => ({ ...current, brand }));
    },
    [knownBrands],
  );

  const setLayout = useCallback((layout: AppShellLayoutKind) => {
    setAppearance((current) => ({ ...current, layout }));
  }, []);

  const toggleLayout = useCallback(() => {
    setAppearance((current) => {
      const next =
        appShellLayoutKinds[
          (appShellLayoutKinds.indexOf(current.layout) + 1) % appShellLayoutKinds.length
        ];
      return { ...current, layout: next };
    });
  }, []);

  const setDensity = useCallback((density: AppearanceDensity) => {
    setAppearance((current) => ({ ...current, density }));
  }, []);

  const toggleDensity = useCallback(() => {
    setAppearance((current) => {
      const next =
        appearanceDensities[
          (appearanceDensities.indexOf(current.density) + 1) % appearanceDensities.length
        ];
      return { ...current, density: next };
    });
  }, []);

  // The active preset is derived, never stored: granular toggles naturally move
  // the appearance to a custom mix (no matching preset → undefined).
  const activePreset = useMemo(() => {
    return presets.find((preset) => {
      const resolved = resolvePreset(preset);
      return (
        resolved.brand === appearance.brand &&
        resolved.layout === appearance.layout &&
        resolved.density === appearance.density
      );
    })?.value;
  }, [presets, resolvePreset, appearance]);

  // Stable identity: a fresh value object here would re-render every
  // useAppearance consumer whenever any parent of the provider re-renders.
  const value = useMemo(
    () => ({
      ...appearance,
      toggleMode,
      presets,
      preset: activePreset,
      applyPreset,
      setBrand,
      setLayout,
      toggleLayout,
      setDensity,
      toggleDensity,
      setCustomColor,
      hydrateAppearance,
    }),
    [
      appearance,
      toggleMode,
      presets,
      activePreset,
      applyPreset,
      setBrand,
      setLayout,
      toggleLayout,
      setDensity,
      toggleDensity,
      setCustomColor,
      hydrateAppearance,
    ],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}
