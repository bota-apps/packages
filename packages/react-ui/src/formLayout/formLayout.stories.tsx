import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { ButtonGroup, FormField, FormGrid } from "./index";
import { Input } from "../input";
import { Label } from "../label";

const meta: Meta<typeof FormGrid> = {
  title: "Forms/FormLayout",
  component: FormGrid,
};
export default meta;

type Story = StoryObj<typeof FormGrid>;

export const TwoColumns: Story = {
  render: () => (
    <FormGrid columns={2}>
      <FormField>
        <Label htmlFor="layout-first">First name</Label>
        <Input id="layout-first" placeholder="First name" />
      </FormField>
      <FormField>
        <Label htmlFor="layout-last">Last name</Label>
        <Input id="layout-last" placeholder="Last name" />
      </FormField>
      <FormField>
        <Label htmlFor="layout-email">Email</Label>
        <Input id="layout-email" type="email" placeholder="you@example.com" />
      </FormField>
      <FormField>
        <Label htmlFor="layout-phone">Phone</Label>
        <Input id="layout-phone" type="tel" placeholder="+1 555 ..." />
      </FormField>
    </FormGrid>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <FormGrid columns={3} gap="lg">
      <FormField>
        <Label htmlFor="layout-city">City</Label>
        <Input id="layout-city" placeholder="City" />
      </FormField>
      <FormField>
        <Label htmlFor="layout-region">Region</Label>
        <Input id="layout-region" placeholder="Region" />
      </FormField>
      <FormField>
        <Label htmlFor="layout-postal">Postal code</Label>
        <Input id="layout-postal" placeholder="Postal code" />
      </FormField>
    </FormGrid>
  ),
};

export const WithButtonGroup: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <FormField>
        <Label htmlFor="layout-org">Organization</Label>
        <Input id="layout-org" placeholder="Organization name" />
      </FormField>
      <ButtonGroup>
        <Button type="submit">Save</Button>
        <Button variant="outline">Cancel</Button>
      </ButtonGroup>
    </div>
  ),
};

export const ContainerScopedColumns: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="w-72 rounded-lg border p-4">
        <FormGrid columns={2}>
          <FormField>
            <Label htmlFor="narrow-city">City</Label>
            <Input id="narrow-city" placeholder="City" />
          </FormField>
          <FormField>
            <Label htmlFor="narrow-country">Country</Label>
            <Input id="narrow-country" placeholder="Country" />
          </FormField>
        </FormGrid>
      </div>
      <div className="flex-1 rounded-lg border p-4">
        <FormGrid columns={2}>
          <FormField>
            <Label htmlFor="wide-city">City</Label>
            <Input id="wide-city" placeholder="City" />
          </FormField>
          <FormField>
            <Label htmlFor="wide-country">Country</Label>
            <Input id="wide-country" placeholder="Country" />
          </FormField>
        </FormGrid>
      </div>
    </div>
  ),
};
