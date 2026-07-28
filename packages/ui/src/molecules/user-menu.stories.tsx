import type { Meta, StoryObj } from "@storybook/react-vite";

import { UserMenu } from "./user-menu";

const meta = {
  title: "Molecules/UserMenu",
  component: UserMenu,
  args: { name: "Ana Souza", email: "user@teste.com" },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Falls back to initials when the identity provider has no picture. */
export const WithAvatar: Story = {
  args: { avatarUrl: "https://i.pravatar.cc/80?img=47" },
};
