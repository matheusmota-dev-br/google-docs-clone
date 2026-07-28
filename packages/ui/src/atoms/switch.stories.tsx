import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

/**
 * Use a switch for settings that apply immediately, and a checkbox for values
 * that only take effect once a form is submitted.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch id="suggesting" {...args} />
      <Label htmlFor="suggesting">Suggesting mode</Label>
    </div>
  ),
};
