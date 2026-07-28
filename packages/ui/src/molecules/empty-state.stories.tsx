import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileSearchIcon, FileTextIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  decorators: [
    (Story) => (
      <div className="w-[32rem] rounded-lg border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoDocuments: Story = {
  args: {
    icon: FileTextIcon,
    title: "No documents yet",
    description: "Pick a template above to create your first document.",
  },
};

/** "Nothing found" and "nothing exists yet" are different states — say which. */
export const NoResults: Story = {
  args: {
    icon: FileSearchIcon,
    title: 'No documents match "quarterly"',
    description: "Try a different search term, or clear the search to see everything.",
    action: (
      <Button variant="outline" size="sm">
        Clear search
      </Button>
    ),
  },
};
