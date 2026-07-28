import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

/** Initials are the fallback whenever the image is missing or fails to load. */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="Grace Hopper" />
      <AvatarFallback>GH</AvatarFallback>
    </Avatar>
  ),
};
