import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Shared" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "secondary", "outline", "destructive"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">Template</Badge>
      <Badge variant="destructive">Deleted</Badge>
    </div>
  ),
};
