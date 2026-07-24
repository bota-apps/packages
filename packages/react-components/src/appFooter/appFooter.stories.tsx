import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppFooter } from "./index";

const meta: Meta<typeof AppFooter> = {
  title: "App/AppFooter",
  component: AppFooter,
};
export default meta;

type Story = StoryObj<typeof AppFooter>;

export const Default: Story = {
  args: {
    legal: "© 2026 Bota Console. All rights reserved.",
    links: [
      { label: "Terms of Service", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Support", href: "#support" },
    ],
  },
};

export const LegalOnly: Story = {
  args: {
    legal: "© 2026 Bota Console.",
  },
};
