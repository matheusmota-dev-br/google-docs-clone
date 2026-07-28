import type { Meta, StoryObj } from "@storybook/react-vite";

import { Progress } from "./progress";

const meta = {
  title: "Atoms/Progress",
  component: Progress,
  args: { value: 60 },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Determinate progress only — for unknown durations use `<Spinner>`. */
export const Steps: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="space-y-4">
      {[0, 33, 66, 100].map((value) => (
        <Progress key={value} value={value} />
      ))}
    </div>
  ),
};
