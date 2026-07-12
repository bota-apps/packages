// UI Primitives barrel export for @bota-apps/react-ui

// HTML primitives layer — single source of truth for raw HTML tags
export * from "./html";

// Charts — theme-aware Recharts wrappers
export * from "./charts";

// Utilities
export * from "./lib/utils";
export * from "./lib/useBreakpoint";
export * from "./lib/useContainerWidth";
export * from "./lib/useCopyToClipboard";
export * from "./print";
export * from "./lib/formatRelativeTime";
export * from "./lib/usePrefersReducedMotion";

// Radix-based UI components
export * from "./accordion";
export * from "./actionLink";
export * from "./alert";
export * from "./alertDialog";
export * from "./appShell";
export * from "./avatar";
export * from "./backLink";
export * from "./badge";
export * from "./button";
export * from "./card";
export * from "./commandPalette";
export * from "./confirmDialog";
export * from "./checkbox";
export * from "./collapsible";
export * from "./contextMenu";
export * from "./dataTable";
export * from "./dateRangeInput";
export * from "./detailField";
export * from "./dialog";
export * from "./documentPreview";
export * from "./dotLeader";
export * from "./dropdownMenu";
export * from "./dynamicDetail";
export * from "./dynamicForm";
export * from "./emptyState";
export * from "./combobox";
export * from "./errorState";
export * from "./fab";
export * from "./featureTile";
// Note: form.tsx (RHF low-level form integration) is omitted from barrel to
// avoid naming collisions with formLayout.tsx's FormField layout helper.
// Import directly: import { ... } from "@bota-apps/react-ui/form"
export * from "./formLayout";

export * from "./headerBar";
export * from "./hero";
export * from "./iconBadge";
export * from "./input";
export * from "./kbd";
export * from "./label";
export * from "./layout";
export * from "./list";
export * from "./listItem";
export * from "./loading";
export * from "./logo";
export * from "./message";
export * from "./navigationMenu";
export * from "./nativeForm";
export * from "./onboardingSteps";
export * from "./page";
export * from "./popover";
export * from "./processTimeline";
export * from "./calendar";
export * from "./pageHeader";
export * from "./pageMenuActions";
export * from "./passwordInput";
export * from "./progress";
export * from "./quickLink";
export * from "./radioGroup";
export * from "./reveal";
export * from "./scrollArea";
export * from "./section";
export * from "./sectionHeader";
export * from "./sectionList";
export * from "./select";
export * from "./separator";
export * from "./sheet";
export * from "./sidebar";
export * from "./sidebarLayout";
export * from "./sidebarNavLink";
export * from "./skeleton";
export * from "./stackedBar";
export * from "./stepFlow";
export * from "./stepper";
export * from "./statCard";
export * from "./animatedNumber";
export * from "./currencyText";
export * from "./dateTime";
export * from "./numericText";
export * from "./emailText";
export * from "./phoneDisplay";
export * from "./statusDot";
export * from "./switch";
export * from "./tabNav";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./themeToggleIcon";
export * from "./timeline";
export * from "./toast";
export * from "./toastNotification";
export * from "./toggle";
export * from "./toggleGroup";
export * from "./tooltip";
export * from "./tree";
export * from "./typography";
export * from "./visuallyHidden";
