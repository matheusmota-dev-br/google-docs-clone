import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Atoms/Input",
  component: Input,
  args: { placeholder: "Untitled document" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="document-name">Document name</Label>
      <Input id="document-name" {...args} />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, value: "Read only" } };

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "" },
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="invalid-input">Document name</Label>
      <Input id="invalid-input" aria-describedby="invalid-hint" {...args} />
      <p id="invalid-hint" className="text-sm text-destructive">
        A document needs a name.
      </p>
    </div>
  ),
};
