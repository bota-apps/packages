import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Text } from "@bota-apps/react-ui";
import { SuspensePageContainer } from "./index";

// Suspends forever — shows the loading fallback.
function NeverResolves(): ReactNode {
  throw new Promise(() => {});
}

function Throws(): ReactNode {
  throw new Error("The projects query failed with status 500.");
}

const meta: Meta<typeof SuspensePageContainer> = {
  title: "react-components/SuspensePageContainer",
  component: SuspensePageContainer,
};

export default meta;
type Story = StoryObj<typeof SuspensePageContainer>;

export const LoadingFallback: Story = {
  render: () => (
    <SuspensePageContainer fallbackTitle="Projects">
      <NeverResolves />
    </SuspensePageContainer>
  ),
};

export const ErrorFallback: Story = {
  render: () => (
    <SuspensePageContainer fallbackTitle="Projects">
      <Throws />
    </SuspensePageContainer>
  ),
};

export const Resolved: Story = {
  render: () => (
    <SuspensePageContainer fallbackTitle="Projects">
      <Text>Content that rendered after its data resolved.</Text>
    </SuspensePageContainer>
  ),
};
