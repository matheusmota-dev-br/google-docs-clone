"use client";

import * as React from "react";
import { MessageSquareIcon } from "lucide-react";

import { EmptyState } from "../molecules/empty-state";
import type { MentionableMember, CommentSubmission } from "../molecules/comment-composer";
import { CommentThread, type ThreadComment } from "./comment-thread";
import { cn } from "../lib/utils";

export interface AnchoredThread {
  id: string;
  quote: string;
  comments: ThreadComment[];
  resolved: boolean;
  /** Distance in pixels from the top of the sidebar to the anchored text. */
  anchorTop: number;
}

export interface ThreadSidebarProps extends React.ComponentPropsWithoutRef<"aside"> {
  threads: AnchoredThread[];
  activeThreadId?: string | null;
  members?: MentionableMember[];
  onSelectThread?: (threadId: string) => void;
  onReply?: (threadId: string, submission: CommentSubmission) => void;
  onToggleResolved?: (threadId: string, resolved: boolean) => void;
  onDeleteThread?: (threadId: string) => void;
  emptyMessage?: string;
}

const GAP = 12;
const ESTIMATED_HEIGHT = 120;

/**
 * The column of comment threads beside the page.
 *
 * Each thread wants to sit level with the text it is attached to, but they
 * must not overlap — so a thread starts at its anchor unless the one above has
 * already claimed that space, in which case it stacks underneath. The active
 * thread is pulled back to its anchor so clicking a highlight always lines up.
 */
const ThreadSidebar = ({
  threads,
  activeThreadId,
  members,
  onSelectThread,
  onReply,
  onToggleResolved,
  onDeleteThread,
  emptyMessage = "Select any text and add a comment to start a conversation.",
  className,
  ...props
}: ThreadSidebarProps) => {
  const [layout, setLayout] = React.useState<{
    tops: Record<string, number>;
    height: number;
  }>({ tops: {}, height: 0 });
  const nodes = React.useRef(new Map<string, HTMLDivElement>());

  const ordered = React.useMemo(
    () => [...threads].sort((a, b) => a.anchorTop - b.anchorTop),
    [threads],
  );

  const measure = React.useCallback(() => {
    let cursor = 0;
    let height = 0;
    const tops: Record<string, number> = {};

    for (const thread of ordered) {
      const top = Math.max(thread.anchorTop, cursor);
      tops[thread.id] = top;
      height = top + (nodes.current.get(thread.id)?.offsetHeight ?? ESTIMATED_HEIGHT);
      cursor = height + GAP;
    }

    setLayout((current) => {
      const unchanged =
        current.height === height &&
        Object.keys(tops).length === Object.keys(current.tops).length &&
        Object.entries(tops).every(([id, top]) => current.tops[id] === top);

      return unchanged ? current : { tops, height };
    });
  }, [ordered]);

  React.useLayoutEffect(() => {
    // ResizeObserver reports the current size as soon as it starts observing,
    // so this both seeds the layout and keeps it in step as threads grow with
    // replies — which shifts everything below them.
    const observer = new ResizeObserver(measure);
    for (const node of nodes.current.values()) observer.observe(node);

    return () => observer.disconnect();
  }, [measure]);

  if (threads.length === 0) {
    return (
      <aside className={cn("w-72", className)} {...props}>
        <EmptyState
          icon={MessageSquareIcon}
          title="No comments yet"
          description={emptyMessage}
          className="py-10"
        />
      </aside>
    );
  }

  return (
    <aside
      aria-label="Comments"
      className={cn("relative w-72", className)}
      style={{ height: layout.height }}
      {...props}
    >
      {ordered.map((thread) => (
        <div
          key={thread.id}
          ref={(node) => {
            if (node) nodes.current.set(thread.id, node);
            else nodes.current.delete(thread.id);
          }}
          className="absolute inset-x-0 transition-[top] duration-200"
          style={{ top: layout.tops[thread.id] ?? thread.anchorTop }}
        >
          <CommentThread
            id={thread.id}
            quote={thread.quote}
            comments={thread.comments}
            resolved={thread.resolved}
            active={thread.id === activeThreadId}
            members={members}
            onSelect={() => onSelectThread?.(thread.id)}
            onReply={onReply ? (submission) => onReply(thread.id, submission) : undefined}
            onToggleResolved={(resolved) => onToggleResolved?.(thread.id, resolved)}
            onDelete={() => onDeleteThread?.(thread.id)}
          />
        </div>
      ))}
    </aside>
  );
};
ThreadSidebar.displayName = "ThreadSidebar";

export { ThreadSidebar };
