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
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium"
        >
          Sign out
        </button>
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
