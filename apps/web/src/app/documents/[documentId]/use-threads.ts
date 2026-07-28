"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type Thread,
  addComment,
  createThread,
  deleteThread,
  readThreads,
  setThreadResolved,
} from "@repo/collab";
import type { Editor } from "@tiptap/react";

import { useCollaboration } from "./collaboration-provider";

export interface ThreadActions {
  threads: Thread[];
  start: (options: {
    threadId: string;
    quote: string;
    body: string;
    mentions: string[];
  }) => void;
  reply: (threadId: string, body: string, mentions: string[]) => void;
  toggleResolved: (threadId: string, resolved: boolean) => void;
  remove: (threadId: string, editor: Editor | null) => void;
}

/**
 * Comment threads for the open document.
 *
 * They live inside the Y.Doc, so this hook is just an observer: every peer
 * sees a write the moment it replicates, with no request in between.
 */
export function useThreads(): ThreadActions {
  const { doc, self } = useCollaboration();
  const [threads, setThreads] = useState<Thread[]>(() => readThreads(doc));

  useEffect(() => {
    const sync = () => setThreads(readThreads(doc));
    const map = doc.getMap("threads");

    sync();
    map.observeDeep(sync);

    return () => map.unobserveDeep(sync);
  }, [doc]);

  const author = { id: self.id, name: self.name, color: self.color };

  const start: ThreadActions["start"] = useCallback(
    ({ threadId, quote, body, mentions }) =>
      createThread(doc, {
        threadId,
        quote,
        author,
        comment: { id: crypto.randomUUID(), body, mentions },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doc, self.id, self.name, self.color],
  );

  const reply: ThreadActions["reply"] = useCallback(
    (threadId, body, mentions) =>
      addComment(doc, threadId, author, { id: crypto.randomUUID(), body, mentions }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doc, self.id, self.name, self.color],
  );

  const toggleResolved: ThreadActions["toggleResolved"] = useCallback(
    (threadId, resolved) => setThreadResolved(doc, threadId, resolved),
    [doc],
  );

  const remove: ThreadActions["remove"] = useCallback(
    (threadId, editor) => {
      deleteThread(doc, threadId);
      editor?.commands.unsetCommentThread(threadId);
    },
    [doc],
  );

  return { threads, start, reply, toggleResolved, remove };
}
