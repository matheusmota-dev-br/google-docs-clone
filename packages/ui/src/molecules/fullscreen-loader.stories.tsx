import type { Meta, StoryObj } from "@storybook/react-vite";

import { FullscreenLoader } from "./fullscreen-loader";

const meta = {
  title: "Molecules/FullscreenLoader",
  component: FullscreenLoader,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FullscreenLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = { args: { label: "Loading document…" } };
