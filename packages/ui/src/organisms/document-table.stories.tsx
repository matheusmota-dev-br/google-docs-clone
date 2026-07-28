import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileSearchIcon, MoreVerticalIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { EmptyState } from "../molecules/empty-state";
import { DocumentTable, type DocumentSummary } from "./document-table";

const documents: DocumentSummary[] = [
  { id: "1", title: "Q3 planning", createdAt: "2026-03-12", owner: "organization" },
  { id: "2", title: "Design review notes", createdAt: "2026-03-09", owner: "personal" },
  { id: "3", title: "Offsite agenda", createdAt: "2026-02-28", owner: "organization" },
  { id: "4", title: "Hiring loop feedback", createdAt: "2026-02-14", owner: "personal" },
];

const meta = {
  title: "Organisms/DocumentTable",
  component: DocumentTable,
  parameters: { layout: "fullscreen" },
  args: {
    documents,
    canLoadMore: true,
    onLoadMore: () => {},
    renderActions: () => (
      <Button variant="ghost" size="icon" aria-label="Document actions">
        <MoreVerticalIcon className="size-4" />
      </Button>
    ),
  },
} satisfies Meta<typeof DocumentTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `documents === undefined` means the query is still in flight. */
export const Loading: Story = { args: { documents: undefined } };

export const Empty: Story = { args: { documents: [] } };

/** A search that returned nothing deserves a different message than "no documents". */
export const NoSearchResults: Story = {
  args: {
    documents: [],
    emptyState: (
      <EmptyState
        icon={FileSearchIcon}
        title={'No documents match "quarterly"'}
        description="Try a different search term, or clear the search to see everything."
      />
    ),
  },
};

export const EndOfResults: Story = { args: { canLoadMore: false } };
