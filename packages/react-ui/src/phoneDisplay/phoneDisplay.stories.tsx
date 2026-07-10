import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhoneDisplay } from "./index";

const meta: Meta<typeof PhoneDisplay> = {
  title: "Display/PhoneDisplay",
  component: PhoneDisplay,
  args: { phone: "+14155550123" },
};
export default meta;

type Story = StoryObj<typeof PhoneDisplay>;

export const Default: Story = {};

export const WithCallButton: Story = {
  args: { showCallButton: true },
};

export const GroupedByCountry: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {/* As given (no country context). */}
      <PhoneDisplay phone="+14155550123" />
      {/* Normalized + grouped for the configured country. */}
      <PhoneDisplay phone="+14155550123" countryCode="1" groups={[3, 3, 4]} />
      {/* National form: the leading trunk 0 is dropped and the code applied. */}
      <PhoneDisplay phone="04155550123" countryCode="1" groups={[3, 3, 4]} showCallButton />
    </div>
  ),
};

export const SizesAndTones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PhoneDisplay phone="+14155550123" size="md" tone="default" />
      <PhoneDisplay phone="+14155550123" size="sm" tone="muted" />
    </div>
  ),
};
