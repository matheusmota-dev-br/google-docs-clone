/**
 * The contract for what lives inside a document's `Y.Doc`.
 *
 * Three shared types, and every peer — the editor in the browser and the
 * Hocuspocus server — agrees on them through this file:
 *
 *   "default"  XmlFragment  the prose itself, owned by Tiptap
 *   "meta"     Map          page setup (margins)
 *   "threads"  Map          comment threads, keyed by thread id
 *
 * Putting the threads *in* the document rather than behind an endpoint is what
 * makes commenting realtime and offline-tolerant for free: they replicate and
 * merge exactly like the text does, and Hocuspocus persists them in the same
 * write. The server mirrors them into Postgres afterwards, but only so that
 * people who are *not* in the document can be notified.
 */
import * as Y from "yjs";

export const PROSE_FIELD = "default";
export const META_KEY = "meta";
export const THREADS_KEY = "threads";

export const LEFT_MARGIN_DEFAULT = 56;
export const RIGHT_MARGIN_DEFAULT = 56;

export interface CommentAuthor {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  body: string;
  /** Keycloak subjects mentioned with `@`. */
  mentions: string[];
  createdAt: number;
}

export interface Thread {
  id: string;
  /** The text the thread was attached to, kept for the sidebar preview. */
  quote: string;
  resolved: boolean;
  createdAt: number;
  comments: Comment[];
}

type ThreadEntry = Y.Map<unknown>;

export const metaMap = (doc: Y.Doc): Y.Map<number> => doc.getMap<number>(META_KEY);

export const threadsMap = (doc: Y.Doc): Y.Map<ThreadEntry> =>
  doc.getMap<ThreadEntry>(THREADS_KEY);

export const getMargins = (doc: Y.Doc) => {
  const meta = metaMap(doc);

  return {
    leftMargin: meta.get("leftMargin") ?? LEFT_MARGIN_DEFAULT,
    rightMargin: meta.get("rightMargin") ?? RIGHT_MARGIN_DEFAULT,
  };
};

export const setMargin = (
  doc: Y.Doc,
  side: "leftMargin" | "rightMargin",
  value: number,
) => metaMap(doc).set(side, value);

const toComment = (entry: Y.Map<unknown>): Comment => ({
  id: String(entry.get("id") ?? ""),
  authorId: String(entry.get("authorId") ?? ""),
  authorName: String(entry.get("authorName") ?? "Anonymous"),
  authorColor: String(entry.get("authorColor") ?? "hsl(0, 0%, 60%)"),
  body: String(entry.get("body") ?? ""),
  mentions: (entry.get("mentions") as string[] | undefined) ?? [],
  createdAt: Number(entry.get("createdAt") ?? 0),
});

const commentsArray = (thread: ThreadEntry): Y.Array<Y.Map<unknown>> =>
  thread.get("comments") as Y.Array<Y.Map<unknown>>;

const toThread = (id: string, entry: ThreadEntry): Thread => ({
  id,
  quote: String(entry.get("quote") ?? ""),
  resolved: Boolean(entry.get("resolved") ?? false),
  createdAt: Number(entry.get("createdAt") ?? 0),
  comments: (commentsArray(entry)?.toArray() ?? []).map(toComment),
});

/** All threads, oldest first. */
export const readThreads = (doc: Y.Doc): Thread[] =>
  [...threadsMap(doc).entries()]
    .map(([id, entry]) => toThread(id, entry))
    .sort((a, b) => a.createdAt - b.createdAt);

export const readThread = (doc: Y.Doc, threadId: string): Thread | null => {
  const entry = threadsMap(doc).get(threadId);

  return entry ? toThread(threadId, entry) : null;
};

const buildComment = (
  author: CommentAuthor,
  body: string,
  mentions: string[],
  id: string,
  createdAt: number,
): Y.Map<unknown> => {
  const comment = new Y.Map<unknown>();
  comment.set("id", id);
  comment.set("authorId", author.id);
  comment.set("authorName", author.name);
  comment.set("authorColor", author.color);
  comment.set("body", body);
  comment.set("mentions", mentions);
  comment.set("createdAt", createdAt);

  return comment;
};

export interface NewComment {
  id: string;
  body: string;
  mentions?: string[];
  createdAt?: number;
}

/** Creates a thread anchored to `quote` and seeds it with the first comment. */
export const createThread = (
  doc: Y.Doc,
  options: {
    threadId: string;
    quote: string;
    author: CommentAuthor;
    comment: NewComment;
  },
): void => {
  const { threadId, quote, author, comment } = options;
  const createdAt = comment.createdAt ?? Date.now();

  doc.transact(() => {
    const thread = new Y.Map<unknown>();
    thread.set("quote", quote);
    thread.set("resolved", false);
    thread.set("createdAt", createdAt);

    const comments = new Y.Array<Y.Map<unknown>>();
    comments.push([
      buildComment(author, comment.body, comment.mentions ?? [], comment.id, createdAt),
    ]);
    thread.set("comments", comments);

    threadsMap(doc).set(threadId, thread);
  });
};

export const addComment = (
  doc: Y.Doc,
  threadId: string,
  author: CommentAuthor,
  comment: NewComment,
): void => {
  const thread = threadsMap(doc).get(threadId);
  if (!thread) return;

  commentsArray(thread).push([
    buildComment(
      author,
      comment.body,
      comment.mentions ?? [],
      comment.id,
      comment.createdAt ?? Date.now(),
    ),
  ]);
};

export const setThreadResolved = (
  doc: Y.Doc,
  threadId: string,
  resolved: boolean,
): void => {
  threadsMap(doc).get(threadId)?.set("resolved", resolved);
};

export const deleteThread = (doc: Y.Doc, threadId: string): void => {
  threadsMap(doc).delete(threadId);
};
