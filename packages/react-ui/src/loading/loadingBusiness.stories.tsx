import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingBusiness } from "./loadingBusiness";

const meta: Meta<typeof LoadingBusiness> = {
  title: "Feedback/LoadingBusiness",
  component: LoadingBusiness,
};
export default meta;

type Story = StoryObj<typeof LoadingBusiness>;

export const Default: Story = {
  render: () => <LoadingBusiness text="Loading businesses…" />,
};

export const Section: Story = {
  render: () => <LoadingBusiness variant="section" size="lg" text="Fetching business profile…" />,
};
