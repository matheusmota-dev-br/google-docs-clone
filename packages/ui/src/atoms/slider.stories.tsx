import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "./slider";

const meta = {
  title: "Atoms/Slider",
  component: Slider,
  args: { defaultValue: [50], max: 100, step: 1 },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Range: Story = { args: { defaultValue: [25, 75] } };

export const Disabled: Story = { args: { disabled: true } };
