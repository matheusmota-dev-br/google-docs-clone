import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotificationInbox } from "./notification-inbox";

const hoursAgo = (hours: number) =>
  new Date(Date.parse("2026-03-12T12:00:00Z") - hours * 3_600_000).toISOString();

const meta = {
  title: "Organisms/NotificationInbox",
  component: NotificationInbox,
  args: {
    unreadCount: 2,
    notifications: [
      {
        id: "1",
        kind: "MENTION",
        actorName: "Maria Lima",
        excerpt: "@Ana Souza can you confirm the numbers in the second table?",
        documentTitle: "Q3 planning",
        createdAt: hoursAgo(1),
      },
      {
        id: "2",
        kind: "COMMENT",
        actorName: "João Pereira",
        excerpt: "Added the migration steps we agreed on.",
        documentTitle: "Software Proposal",
        createdAt: hoursAgo(5),
      },
      {
        id: "3",
        kind: "COMMENT",
        actorName: "Maria Lima",
        excerpt: "Looks good to me.",
        documentTitle: "Offsite agenda",
        createdAt: hoursAgo(30),
        read: true,
      },
    ],
  },
} satisfies Meta<typeof NotificationInbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithNotifications: Story = {};

export const Empty: Story = { args: { notifications: [], unreadCount: 0 } };
