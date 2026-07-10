import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./index";

const meta: Meta<typeof Accordion> = {
  title: "Display/Accordion",
  component: Accordion,
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="a">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes — it follows the WAI-ARIA pattern via Radix.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is it themeable?</AccordionTrigger>
        <AccordionContent>Yes — every color resolves through CSS variables.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
