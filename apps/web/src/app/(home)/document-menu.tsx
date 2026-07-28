"use client";

import { ExternalLinkIcon, FilePenIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "@repo/ui/atoms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/molecules";

import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";

interface DocumentMenuProps {
  documentId: string;
  title: string;
  onNewTab: (id: string) => void;
  onChanged?: () => void;
}

export const DocumentMenu = ({
  documentId,
  title,
  onNewTab,
  onChanged,
}: DocumentMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label={`Actions for ${title}`}
        onClick={(event) => event.stopPropagation()}
      >
        <MoreVerticalIcon className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
      <RenameDialog documentId={documentId} initialTitle={title} onRenamed={onChanged}>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          onClick={(event) => event.stopPropagation()}
        >
          <FilePenIcon className="mr-2 size-4" />
          Rename
        </DropdownMenuItem>
      </RenameDialog>
      <RemoveDialog documentId={documentId} onRemoved={onChanged}>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          onClick={(event) => event.stopPropagation()}
        >
          <TrashIcon className="mr-2 size-4" />
          Remove
        </DropdownMenuItem>
      </RemoveDialog>
      <DropdownMenuItem onClick={() => onNewTab(documentId)}>
        <ExternalLinkIcon className="mr-2 size-4" />
        Open in a new tab
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
