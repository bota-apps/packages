import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, PageContent, ContentSurface } from "./index";
import { PageHeader } from "../pageHeader";
import { Button } from "../button";
import { Card } from "../card";

const meta: Meta<typeof Page> = {
  title: "Layout/Page",
  component: Page,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  render: () => (
    <Page>
      <PageContent region="header">
        <PageHeader
          title="Projects"
          description="Manage the projects in your workspace."
          action={<Button>Add project</Button>}
        />
      </PageContent>
      <PageContent region="body">
        <ContentSurface>
          <Card title="Directory" description="Page body content on a content surface." />
        </ContentSurface>
      </PageContent>
    </Page>
  ),
};

export const Narrow: Story = {
  render: () => (
    <Page>
      <PageContent variant="narrow">
        <Card title="Settings" description="Narrow content width for focused forms." />
      </PageContent>
    </Page>
  ),
};
