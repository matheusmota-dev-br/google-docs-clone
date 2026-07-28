import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThreadSidebar } from "./thread-sidebar";

const comment = (id: string, name: string, color: string, body: string) => ({
  id,
  authorId: id,
  authorName: name,
  authorColor: color,
  body,
  createdAt: Date.parse("2026-03-12T09:41:00Z"),
});

/**
 * The rail beside the page. Each thread wants to sit level with the text it is
 * attached to; when two anchors are close together the lower thread stacks
 * underneath instead of overlapping.
 */
const meta = {
  title: "Organisms/ThreadSidebar",
  component: ThreadSidebar,
  parameters: { layout: "padded" },
  args: {
    onReply: () => {},
    threads: [
      {
        id: "t1",
        quote: "we should ship this before the offsite",
        resolved: false,
        anchorTop: 0,
        comments: [
          comment("1", "Ana Souza", "hsl(185, 72%, 55%)", "Is that date realistic?"),
        ],
      },
      {
        id: "t2",
        quote: "the migration runs in three phases",
        resolved: false,
        anchorTop: 40,
        comments: [
          comment(
            "2",
            "Maria Lima",
            "hsl(295, 72%, 55%)",
            "Phase two needs a rollback plan.",
          ),
          comment("3", "João Pereira", "hsl(324, 72%, 55%)", "Agreed, I'll write it up."),
        ],
      },
      {
        id: "t3",
        quote: "budget approved by finance",
        resolved: true,
        anchorTop: 380,
        comments: [
          comment("4", "Ana Souza", "hsl(185, 72%, 55%)", "Confirmed on Tuesday."),
        ],
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="h-[560px] bg-canvas p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThreadSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The second thread is pushed down: its anchor is only 40px below the first. */
export const Anchored: Story = {};

export const WithActiveThread: Story = { args: { activeThreadId: "t2" } };

export const Empty: Story = { args: { threads: [] } };
