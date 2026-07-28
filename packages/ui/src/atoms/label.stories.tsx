import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  args: { children: "Share with my organization" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Wrapping a control makes the whole label a hit target. */
export const BoundToControl: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="share" />
      <Label htmlFor="share" {...args} />
    </div>
  ),
};
