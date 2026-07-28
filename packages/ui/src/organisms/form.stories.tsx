import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";

import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

/**
 * `<Form>` wires `react-hook-form` state to the design system's labels,
 * descriptions and error messages — including the `aria-describedby` and
 * `aria-invalid` attributes screen readers rely on.
 */
const meta: Meta<typeof Form> = {
  title: "Organisms/Form",
  component: Form,
};

export default meta;
type Story = StoryObj<typeof Form>;

const RenameForm = () => {
  const form = useForm<{ title: string }>({
    defaultValues: { title: "" },
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="w-80 space-y-6" noValidate>
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "A document needs a name." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document name</FormLabel>
              <FormControl>
                <Input placeholder="Untitled document" {...field} />
              </FormControl>
              <FormDescription>
                Shown in the documents list and tab title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

/** Submit with an empty field to see validation and error wiring. */
export const Rename: Story = { render: () => <RenameForm /> };
