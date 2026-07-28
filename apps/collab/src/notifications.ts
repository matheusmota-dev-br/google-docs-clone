import { type Prisma, prisma } from "@repo/db";
import { readThreads } from "@repo/collab";
import type * as Y from "yjs";

/**
 * Comment ids already turned into notifications, per document.
 *
 * Threads live inside the Y.Doc, so the only signal we get is "the document
 * changed". Remembering what we have seen keeps the mirroring pass cheap; the
 * unique index on (recipientId, commentId) keeps it correct across restarts,
 * when this cache starts empty again.
 */
const mirrored = new Map<string, Set<string>>();

export const forgetDocument = (documentId: string): void => {
  mirrored.delete(documentId);
};

const excerptOf = (body: string): string =>
  body.length > 140 ? `${body.slice(0, 139)}…` : body;

/**
 * Turns new comments into inbox rows for everyone involved in the thread who is
 * not the author. People reading the document live already see the comment
 * through Yjs — this exists for the people who are not.
 */
export const mirrorThreadsToNotifications = async (
  documentId: string,
  doc: Y.Doc,
): Promise<void> => {
  const alreadyMirrored = mirrored.get(documentId) ?? new Set<string>();
  const threads = readThreads(doc);

  const allCommentIds = new Set<string>();
  const rows: Prisma.NotificationCreateManyInput[] = [];

  let document: { ownerId: string } | null = null;

  for (const thread of threads) {
    for (const [index, comment] of thread.comments.entries()) {
      allCommentIds.add(comment.id);
      if (alreadyMirrored.has(comment.id)) continue;

      document ??= await prisma.document.findUnique({
        where: { id: documentId },
        select: { ownerId: true },
      });
      if (!document) return;

      // Who was already part of the conversation when this comment was posted.
      const participants = new Set<string>([
        document.ownerId,
        ...thread.comments.slice(0, index).map((earlier) => earlier.authorId),
      ]);

      const recipients = new Map<string, Prisma.NotificationCreateManyInput["kind"]>();
      for (const participant of participants) {
        if (participant !== comment.authorId) recipients.set(participant, "COMMENT");
      }
      // A mention outranks a plain reply.
      for (const mention of comment.mentions) {
        if (mention !== comment.authorId) recipients.set(mention, "MENTION");
      }

      for (const [recipientId, kind] of recipients) {
        rows.push({
          recipientId,
          documentId,
          threadId: thread.id,
          commentId: comment.id,
          kind,
          actorId: comment.authorId,
          actorName: comment.authorName,
          excerpt: excerptOf(comment.body),
        });
      }
    }
  }

  mirrored.set(documentId, allCommentIds);

  if (rows.length > 0) {
    await prisma.notification.createMany({ data: rows, skipDuplicates: true });
  }
};
