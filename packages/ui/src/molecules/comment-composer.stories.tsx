import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommentComposer } from "./comment-composer";

/**
 * Type `@` to try mention completion — arrow keys to move, Enter or Tab to
 * accept. ⌘/Ctrl+Enter submits, Escape cancels.
 */
const meta = {
  title: "Molecules/CommentComposer",
  component: CommentComposer,
  args: {
    onSubmit: () => {},
    members: [
      { id: "1", name: "Ana Souza" },
      { id: "2", name: "Maria Lima" },
      { id: "3", name: "João Pereira" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-72 rounded-lg border bg-card p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Reply: Story = {
  args: { placeholder: "Reply…", submitLabel: "Reply", onCancel: () => {} },
};

/** Without a member list the `@` completion stays out of the way. */
export const WithoutMentions: Story = { args: { members: [] } };
