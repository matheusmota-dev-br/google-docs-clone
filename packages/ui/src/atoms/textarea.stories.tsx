import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  args: { placeholder: "Leave a comment…" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="comment">Comment</Label>
      <Textarea id="comment" {...args} />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
