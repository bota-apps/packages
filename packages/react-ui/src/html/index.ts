// html/ — single source of truth for all raw HTML element usage in @bota-apps/react-ui.
// Every raw HTML tag in the package renders only through one of these primitives.
// All CVA variant definitions live here. Components outside this folder import from here.

// HTML element primitives
export * from "./a";
export * from "./button";
export * from "./div";
export * from "./form";
export * from "./heading";
export * from "./header";
export * from "./iframe";
export * from "./img";
export * from "./input";
export * from "./label";
export * from "./main";
export * from "./nav";
export * from "./p";
export * from "./section";
export * from "./span";
export * from "./table";
export * from "./textarea";
export * from "./ul";

// Semantic UI element primitives (render a specific HTML element for a specific purpose)
export * from "./alert";
export * from "./badge";
export * from "./card";
export * from "./loading";
export * from "./notification";
export * from "./skeleton";

export * from "./accordion";
export * from "./page";
export * from "./sectionList";
export * from "./themeToggle";
export * from "./tree";

// Foundational cva definitions shared across components (no rendered primitives)
export * from "./menu";
export * from "./overlay";
export * from "./trigger";

// Note: html/layout.tsx and html/typography.tsx contain the CVA for the layout
// and typography primitives, but they are NOT re-exported here to avoid double
// exposure through the top-level barrel (index.ts already has
// `export * from "./layout"` and `export * from "./typography"`).
// Those files delegate to html/layout.tsx and html/typography.tsx.
