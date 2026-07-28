import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarStack } from "./avatar-stack";

const users = [
  { id: 1, name: "Ada Lovelace", avatar: "https://i.pravatar.cc/80?img=47" },
  { id: 2, name: "Grace Hopper", avatar: "https://i.pravatar.cc/80?img=32" },
  { id: 3, name: "Alan Turing", avatar: "https://i.pravatar.cc/80?img=13" },
  { id: 4, name: "Katherine Johnson", avatar: "https://i.pravatar.cc/80?img=45" },
  { id: 5, name: "Linus Torvalds", avatar: "https://i.pravatar.cc/80?img=68" },
  { id: 6, name: "Margaret Hamilton", avatar: "https://i.pravatar.cc/80?img=25" },
  { id: 7, name: "Barbara Liskov", avatar: "https://i.pravatar.cc/80?img=44" },
];

const meta = {
  title: "Molecules/AvatarStack",
  component: AvatarStack,
  args: { users: users.slice(0, 3) },
} satisfies Meta<typeof AvatarStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Beyond `max` the remaining collaborators collapse into a counter. */
export const Overflowing: Story = { args: { users, max: 4 } };

export const Small: Story = { args: { users: users.slice(0, 4), size: "sm" } };
