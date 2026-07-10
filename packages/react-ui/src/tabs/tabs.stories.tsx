import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel.</TabsContent>
      <TabsContent value="activity">Activity panel.</TabsContent>
      <TabsContent value="settings">Settings panel.</TabsContent>
    </Tabs>
  ),
};
