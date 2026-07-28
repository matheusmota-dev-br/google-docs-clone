import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon } from "lucide-react";

import { Toggle } from "./toggle";

const meta = {
  title: "Atoms/Toggle",
  component: Toggle,
  args: { "aria-label": "Bold", children: <BoldIcon /> },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = { args: { defaultPressed: true } };

export const Outline: Story = { args: { variant: "outline" } };
