import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { Button } from "../button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./index";
import { Input } from "../input";
import { Textarea } from "../textarea";

const meta: Meta<typeof Form> = {
  title: "Forms/Form",
  component: Form,
};
export default meta;

type Story = StoryObj<typeof Form>;

type ProfileValues = {
  username: string;
  bio: string;
};

function ProfileForm() {
  const form = useForm<ProfileValues>({
    defaultValues: { username: "", bio: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="w-96 space-y-6">
        <FormField
          control={form.control}
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="musema" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          rules={{ maxLength: { value: 160, message: "Bio must be 160 characters or fewer" } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

export const Default: Story = {
  render: () => <ProfileForm />,
};
