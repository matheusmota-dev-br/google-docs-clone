"use client";

import { useMemo } from "react";
import type { Editor } from "@tiptap/react";
import { CommentComposer } from "@repo/ui/molecules";
import { ThreadSidebar, type AnchoredThread } from "@repo/ui/organisms";

import { useWorkspace } from "@/components/providers";
import { useMembers } from "@/hooks/use-members";
import { useCommentsStore } from "@/store/use-comments-store";
import { useThreadAnchors } from "./use-thread-anchors";
import { useThreads } from "./use-threads";

interface ThreadsProps {
  editor: Editor | null;
  container: HTMLElement | null;
  /** Stack threads as a plain list instead of aligning them to the text. */
  stacked?: boolean;
}

/**
 * The comment rail beside the page: one card per thread, lined up with the text
 * it is attached to, plus the composer for a thread that has been anchored but
 * not yet written.
 */
export const Threads = ({ editor, container, stacked = false }: ThreadsProps) => {
  const { threads, start, reply, toggleResolved, remove } = useThreads();
  const anchors = useThreadAnchors(editor, container);
  const { activeOrganization } = useWorkspace();
  const members = useMembers(activeOrganization);

  const { pending, activeThreadId, showResolved, cancelThread, setActiveThread } =
    useCommentsStore();

  const anchored: AnchoredThread[] = useMemo(
    () =>
      threads
        .filter((thread) => showResolved || !thread.resolved)
        .map((thread) => ({
          id: thread.id,
          quote: thread.quote,
          resolved: thread.resolved,
          comments: thread.comments,
          anchorTop: stacked ? 0 : (anchors[thread.id] ?? 0),
        })),
    [threads, anchors, showResolved, stacked],
  );

  const focusThread = (threadId: string) => {
    setActiveThread(threadId);

    const anchor = editor?.view.dom.querySelector<HTMLElement>(
      `[data-thread-id="${threadId}"]`,
    );
    anchor?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="w-72 shrink-0 space-y-3">
      {pending && (
        <div
          className="rounded-lg border border-primary bg-card p-3 shadow-paper"
          style={stacked ? undefined : { marginTop: anchors[pending.id] ?? 0 }}
        >
          <p className="mb-2 truncate border-l-2 border-primary/50 pl-2 text-xs italic text-muted-foreground">
            {pending.quote}
          </p>
          <CommentComposer
            autoFocus
            members={members}
            onCancel={() => {
              editor?.commands.unsetCommentThread(pending.id);
              cancelThread();
            }}
            onSubmit={({ body, mentions }) => {
              start({ threadId: pending.id, quote: pending.quote, body, mentions });
              cancelThread();
            }}
          />
        </div>
      )}

      <ThreadSidebar
        threads={anchored}
        activeThreadId={activeThreadId}
        members={members}
        onSelectThread={focusThread}
        onReply={(threadId, { body, mentions }) => reply(threadId, body, mentions)}
        onToggleResolved={toggleResolved}
        onDeleteThread={(threadId) => remove(threadId, editor)}
        className="w-full"
      />
    </div>
  );
};
