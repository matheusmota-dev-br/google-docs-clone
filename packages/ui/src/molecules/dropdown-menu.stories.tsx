import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLinkIcon, FilePenIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";

import { Button } from "../atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "Molecules/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The per-row actions menu used by the documents table. */
export const DocumentActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Document actions">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Q3 planning</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <FilePenIcon className="mr-2 size-4" />
          Rename
          <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLinkIcon className="mr-2 size-4" />
          Open in a new tab
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <TrashIcon className="mr-2 size-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
