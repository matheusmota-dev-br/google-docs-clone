"use client";

import * as React from "react";
import { Building2Icon, CircleUserIcon, FileTextIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { Spinner } from "../atoms/spinner";
import { EmptyState } from "../molecules/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../molecules/table";
import { cn } from "../lib/utils";

export interface DocumentSummary {
  id: string;
  title: string;
  /** Anything `new Date()` understands. */
  createdAt: string | number | Date;
  owner: "personal" | "organization";
}

export interface DocumentTableProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "onSelect"
> {
  /** `undefined` means "still loading" — an empty array means "nothing found". */
  documents?: DocumentSummary[];
  onSelect?: (document: DocumentSummary) => void;
  /** Row-level actions, typically a `<DropdownMenu>` trigger. */
  renderActions?: (document: DocumentSummary) => React.ReactNode;
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  isLoadingMore?: boolean;
  emptyState?: React.ReactNode;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});

/**
 * The "recent documents" list. Every piece of data arrives as plain props, so
 * the same organism backs the real Convex query and the Storybook fixtures.
 */
const DocumentTable = ({
  documents,
  onSelect,
  renderActions,
  onLoadMore,
  canLoadMore = false,
  isLoadingMore = false,
  emptyState,
  className,
  ...props
}: DocumentTableProps) => (
  <div
    className={cn(
      "mx-auto flex max-w-screen-xl flex-col gap-5 px-6 py-6 lg:px-16",
      className,
    )}
    {...props}
  >
    {documents === undefined ? (
      <div className="flex h-24 items-center justify-center">
        <Spinner size="sm" label="Loading documents" />
      </div>
    ) : documents.length === 0 ? (
      (emptyState ?? (
        <EmptyState
          icon={FileTextIcon}
          title="No documents yet"
          description="Pick a template above to create your first document."
        />
      ))
    ) : (
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="w-[52px]" />
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Shared</TableHead>
            <TableHead className="hidden md:table-cell">Created at</TableHead>
            <TableHead className="w-[52px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow
              key={document.id}
              tabIndex={0}
              role="link"
              onClick={() => onSelect?.(document)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSelect?.(document);
              }}
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <TableCell>
                <FileTextIcon className="size-5 text-primary" aria-hidden />
              </TableCell>
              <TableCell className="font-medium md:w-[45%]">{document.title}</TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                <span className="flex items-center gap-2">
                  {document.owner === "organization" ? (
                    <Building2Icon className="size-4" aria-hidden />
                  ) : (
                    <CircleUserIcon className="size-4" aria-hidden />
                  )}
                  {document.owner === "organization" ? "Organization" : "Personal"}
                </span>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {dateFormatter.format(new Date(document.createdAt))}
              </TableCell>
              <TableCell className="text-right">{renderActions?.(document)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}

    {onLoadMore && (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoadMore}
          disabled={!canLoadMore || isLoadingMore}
        >
          {isLoadingMore ? (
            <Spinner size="sm" label="Loading more documents" />
          ) : canLoadMore ? (
            "Load more"
          ) : (
            "End of results"
          )}
        </Button>
      </div>
    )}
  </div>
);
DocumentTable.displayName = "DocumentTable";

export { DocumentTable };
