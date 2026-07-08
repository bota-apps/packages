import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // The React plugin gives component tests the automatic JSX runtime.
  plugins: [react()],
  test: {
    // jsdom so React component tests (*.test.tsx) can render; pure logic tests
    // (*.test.ts) run here too.
    environment: "jsdom",
    // Shared jsdom polyfills (ResizeObserver, matchMedia, scrollIntoView,
    // pointer capture) + Testing Library auto-cleanup for all package tests.
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "packages/**/*.test.{ts,tsx}",
      "mocks/**/*.test.{ts,tsx}",
      "testing/**/*.test.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**", "mocks/src/**", "testing/src/**"],
      exclude: ["packages/*/src/**/*.test.*", "packages/*/src/**/index.ts"],
      reporter: ["text", "html"],
      // Floor, not target: fails the run if coverage regresses below what the
      // current suite provides. Ratchet upward as suites grow.
      thresholds: {
        "packages/schema-utils/src/currency.ts": { lines: 90 },
        "packages/react-ui/src/dynamicForm/zodBuilder.ts": { lines: 90 },
        "packages/react-ui/src/lib/formatRelativeTime.ts": { lines: 90 },
        "packages/auth-client/src/authStore.ts": { lines: 90 },
        "packages/fm/src/errors/classify.ts": { lines: 60 },
      },
    },
  },
});
