import { Injectable } from "@nestjs/common";

import type { AuthUser } from "../auth/auth-user";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Inbox for the caller. Rows are written by the collaboration server when a
   * comment lands in a document's Y.Doc — this endpoint only reads them.
   */
  async list(user: AuthUser, limit = 30) {
    const rows = await this.prisma.notification.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { document: { select: { id: true, title: true } } },
    });

    return {
      items: rows.map((row) => ({
        id: row.id,
        kind: row.kind,
        threadId: row.threadId,
        commentId: row.commentId,
        actorName: row.actorName,
        excerpt: row.excerpt,
        readAt: row.readAt,
        createdAt: row.createdAt,
        document: row.document,
      })),
      unreadCount: rows.filter((row) => row.readAt === null).length,
    };
  }

  /** Marks the given notifications read, or the whole inbox when `ids` is empty. */
  async markRead(user: AuthUser, ids?: string[]) {
    await this.prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        readAt: null,
        ...(ids?.length ? { id: { in: ids } } : {}),
      },
      data: { readAt: new Date() },
    });
  }
}
