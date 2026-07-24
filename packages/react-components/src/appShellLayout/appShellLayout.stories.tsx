import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShellLayout } from "./index";

const meta: Meta<typeof AppShellLayout> = {
  title: "App/AppShellLayout",
  component: AppShellLayout,
};
export default meta;

type Story = StoryObj<typeof AppShellLayout>;

export const Default: Story = {
  render: () => (
    <AppShellLayout
      brand={<span className="text-lg font-semibold">Bota Console</span>}
      nav={
        <>
          <a className="rounded-lg px-3 py-2 text-sm font-medium text-primary" href="#home">
            Home
          </a>
          <a
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
            href="#people"
          >
            People
          </a>
        </>
      }
      headerLeft={<span className="text-sm text-muted-foreground">Signed in as Jane Doe</span>}
      headerRight={
        <button
          type="button"
          className="rounded-md border border-sidebar-border px-3 py-1.5 text-sm font-medium"
        >
          Sign out
        </button>
      }
      sidebarFooter={
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            JD
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">Jane Doe</span>
            <span className="truncate text-xs">Administrator</span>
          </span>
        </div>
      }
      footer={
        <footer className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
          © 2026 Bota Console · Terms · Privacy
        </footer>
      }
    >
      <div className="rounded-lg border border-dashed border-border p-8 text-muted-foreground">
        Page content renders in the content well beside the rail.
      </div>
    </AppShellLayout>
  ),
};

export const WithoutHeaderSlots: Story = {
  render: () => (
    <AppShellLayout
      brand={<span className="text-lg font-semibold">Bota Console</span>}
      nav={<span />}
    >
      <div className="rounded-lg border border-dashed border-border p-8 text-muted-foreground">
        Minimal shell — no header content.
      </div>
    </AppShellLayout>
  ),
};

export const Topnav: Story = {
  render: () => (
    <AppShellLayout
      layout="topnav"
      brand={<span className="text-lg font-semibold">Bota Console</span>}
      nav={
        <>
          <a className="rounded-lg px-3 py-2 text-sm font-medium text-primary" href="#home">
            Home
          </a>
          <a
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
            href="#people"
          >
            People
          </a>
        </>
      }
      headerLeft={<span className="text-sm text-muted-foreground">Signed in as Jane Doe</span>}
      headerRight={
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium"
        >
          Sign out
        </button>
      }
    >
      <div className="rounded-lg border border-dashed border-border p-8 text-muted-foreground">
        Same slots, single top bar — full-width content well.
      </div>
    </AppShellLayout>
  ),
};
