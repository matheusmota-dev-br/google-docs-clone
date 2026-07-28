import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommentThread } from "./comment-thread";

const comments = [
  {
    id: "c1",
    authorId: "1",
    authorName: "Ana Souza",
    authorColor: "hsl(185, 72%, 55%)",
    body: "@Maria Lima can you double-check this paragraph before we send it?",
    createdAt: Date.parse("2026-03-12T09:41:00Z"),
  },
  {
    id: "c2",
    authorId: "2",
    authorName: "Maria Lima",
    authorColor: "hsl(295, 72%, 55%)",
    body: "On it — I'll have it reviewed this afternoon.",
    createdAt: Date.parse("2026-03-12T10:02:00Z"),
  },
];

const meta = {
  title: "Organisms/CommentThread",
  component: CommentThread,
  args: {
    id: "t1",
    quote: "we should ship this before the offsite",
    comments,
    onReply: () => {},
    members: [
      { id: "1", name: "Ana Souza" },
      { id: "2", name: "Maria Lima" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentThread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The thread the reader currently has selected in the document. */
export const Active: Story = { args: { active: true } };

export const Resolved: Story = { args: { resolved: true } };

/** A thread whose anchor was edited away still shows its conversation. */
export const AnchorLost: Story = { args: { quote: "" } };
