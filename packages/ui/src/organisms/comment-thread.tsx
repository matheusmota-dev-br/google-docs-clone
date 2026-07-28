"use client";

import * as React from "react";
import { CheckIcon, MoreVerticalIcon, RotateCcwIcon, TrashIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "../atoms/avatar";
import { Button } from "../atoms/button";
import {
  CommentComposer,
  type CommentSubmission,
  type MentionableMember,
} from "../molecules/comment-composer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../molecules/dropdown-menu";
import { cn } from "../lib/utils";

export interface ThreadComment {
  id: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  body: string;
  createdAt: number;
}

export interface CommentThreadProps extends Omit<
  React.ComponentPropsWithoutRef<"article">,
  "id" | "onSelect"
> {
  id: string;
  quote: string;
  comments: ThreadComment[];
  resolved?: boolean;
  active?: boolean;
  members?: MentionableMember[];
  onReply?: (submission: CommentSubmission) => void;
  onToggleResolved?: (resolved: boolean) => void;
  onDelete?: () => void;
  onSelect?: () => void;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  day: "numeric",
});

/**
 * One conversation anchored to a span of the document.
 *
 * Purely presentational: the thread's data lives in the document's Y.Doc, and
 * the caller decides what replying or resolving actually does.
 */
const CommentThread = ({
  id,
  quote,
  comments,
  resolved = false,
  active = false,
  members,
  onReply,
  onToggleResolved,
  onDelete,
  onSelect,
  className,
  ...props
}: CommentThreadProps) => {
  const [replying, setReplying] = React.useState(false);

  return (
    <article
      data-thread-id={id}
      onClick={onSelect}
      className={cn(
        "rounded-lg border bg-card p-3 text-sm shadow-sm transition-all",
        active ? "border-primary shadow-paper" : "hover:border-primary/40",
        resolved && "opacity-60",
        className,
      )}
      {...props}
    >
      <header className="mb-2 flex items-start gap-2">
        <p className="flex-1 truncate border-l-2 border-primary/50 pl-2 text-xs italic text-muted-foreground">
          {quote || "(selection removed)"}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              aria-label="Thread actions"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onToggleResolved?.(!resolved)}>
              {resolved ? (
                <>
                  <RotateCcwIcon className="mr-2 size-4" />
                  Reopen
                </>
              ) : (
                <>
                  <CheckIcon className="mr-2 size-4" />
                  Resolve
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon className="mr-2 size-4" />
              Delete thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <ol className="space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-2">
            <Avatar className="mt-0.5 size-6 shrink-0">
              <AvatarFallback
                className="text-[10px] font-medium text-white"
                style={{ backgroundColor: comment.authorColor }}
              >
                {initials(comment.authorName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2">
                <span className="truncate text-xs font-medium">{comment.authorName}</span>
                <time
                  dateTime={new Date(comment.createdAt).toISOString()}
                  className="shrink-0 text-[11px] text-muted-foreground"
                >
                  {timeFormatter.format(new Date(comment.createdAt))}
                </time>
              </p>
              <p className="whitespace-pre-wrap break-words text-sm">{comment.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {onReply && (
        <div className="mt-3" onClick={(event) => event.stopPropagation()}>
          {replying ? (
            <CommentComposer
              autoFocus
              members={members}
              placeholder="Reply…"
              submitLabel="Reply"
              onCancel={() => setReplying(false)}
              onSubmit={(submission) => {
                onReply(submission);
                setReplying(false);
              }}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setReplying(true)}
            >
              Reply
            </Button>
          )}
        </div>
      )}
    </article>
  );
};
CommentThread.displayName = "CommentThread";

export { CommentThread };
