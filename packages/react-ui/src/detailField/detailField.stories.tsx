import type { Meta, StoryObj } from "@storybook/react";
import { Mail, MapPin, Calendar, Building2 } from "lucide-react";
import { DetailField, InfoRow } from "./index";
import { TooltipProvider } from "../tooltip";

const meta: Meta<typeof DetailField> = {
  title: "Display/DetailField",
  component: DetailField,
};
export default meta;

type Story = StoryObj<typeof DetailField>;

export const Default: Story = {
  render: () => <DetailField label="Department" value="Engineering" />,
};

export const WithIcon: Story = {
  render: () => (
    <DetailField icon={<MapPin />} label="Work location" value="Addis Ababa, Ethiopia" />
  ),
};

export const Copyable: Story = {
  render: () => (
    <TooltipProvider>
      <DetailField
        icon={<Mail />}
        label="Email"
        value="sara.tesfaye@example.com"
        copyable
        copyValue="sara.tesfaye@example.com"
      />
    </TooltipProvider>
  ),
};

export const InfoRows: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <InfoRow icon={<Building2 />}>Abyssinia Coffee PLC</InfoRow>
      <InfoRow icon={<Calendar />}>Joined February 2023</InfoRow>
      <InfoRow icon={<MapPin />}>Addis Ababa</InfoRow>
    </div>
  ),
};
