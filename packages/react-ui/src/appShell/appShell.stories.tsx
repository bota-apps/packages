import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "./index";
import { HeaderBar } from "../headerBar";
import { Logo } from "../logo";
import { Button } from "../button";
import { Card } from "../card";

const meta: Meta<typeof AppShell> = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  render: () => (
    <AppShell
      header={<HeaderBar brand={<Logo />} actions={<Button variant="outline">Sign out</Button>} />}
    >
      <Card title="Dashboard" description="Main app content renders inside the shell.">
        <p>Page content goes here.</p>
      </Card>
    </AppShell>
  ),
};

export const Auth: Story = {
  render: () => (
    <AppShell variant="auth" footer="© 2026 Bota Apps. All rights reserved.">
      <Card title="Sign in" description="Centered auth layout with logo and footer.">
        <Button className="w-full">Continue</Button>
      </Card>
    </AppShell>
  ),
};
