// @bota-apps/react-components — the app-runtime layer shared by every authenticated
// app. These wire auth + data + feature providers and the app chrome around the
// context-free primitives in @bota-apps/react-ui. Apps pass their config/router/nav
// in, so a fix here applies everywhere instead of being copied into each app.

// App-context providers (appearance / toast / error boundary)
export * from "./appearanceProvider";
export * from "./toast";
export * from "./errorBoundary";

// App chrome
export * from "./appShellLayout";
export * from "./navList";
export * from "./appShell";
export * from "./themeToggle";
export * from "./presetSelect";
export * from "./layoutToggle";
export * from "./densityToggle";
export * from "./languageToggle";
export * from "./userMenu";
export * from "./orgSwitcherMenu";

// Routing surfaces
export * from "./routeLink";
export * from "./breadcrumbs";
export * from "./notFound";
export * from "./routeError";

// Page machinery
export * from "./pageContainer";
export * from "./derivePageState";
export * from "./suspensePageContainer";

// Actions
export * from "./actions";

// Feature-tree navigation
export * from "./navigation";

// Feature bridge
export * from "./featurePageGuard";
export * from "./featureCard";

// Audit log
export * from "./entityAuditLog";

// Composed provider stack
export * from "./createAppRoot";
