import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Form } from "./index";
import { Textarea } from "../textarea";

const meta: Meta<typeof Form> = {
  title: "Forms/NativeForm",
  component: Form,
};
export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form gap="md" className="w-96" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-2">
        <Label htmlFor="native-name">Name</Label>
        <Input id="native-name" name="name" placeholder="Your name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="native-email">Email</Label>
        <Input id="native-email" name="email" type="email" placeholder="you@example.com" />
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const LargeGap: Story = {
  render: () => (
    <Form gap="lg" className="w-96" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-2">
        <Label htmlFor="native-subject">Subject</Label>
        <Input id="native-subject" name="subject" placeholder="Subject" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="native-message">Message</Label>
        <Textarea id="native-message" name="message" placeholder="Write your message" rows={4} />
      </div>
      <Button type="submit">Send</Button>
    </Form>
  ),
};
