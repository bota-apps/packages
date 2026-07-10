import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building2, CreditCard, User } from "lucide-react";
import { OnboardingSteps, type OnboardingStepConfig } from "./index";

const meta: Meta<typeof OnboardingSteps> = {
  title: "Navigation/OnboardingSteps",
  component: OnboardingSteps,
};
export default meta;

type Story = StoryObj<typeof OnboardingSteps>;

const steps: OnboardingStepConfig[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "business", label: "Business", icon: Building2 },
  { key: "billing", label: "Billing", icon: CreditCard },
];

export const Default: Story = {
  render: () => <OnboardingSteps steps={steps} current="business" />,
};

export const FirstStep: Story = {
  render: () => <OnboardingSteps steps={steps} current="profile" />,
};

export const LastStep: Story = {
  render: () => <OnboardingSteps steps={steps} current="billing" />,
};
