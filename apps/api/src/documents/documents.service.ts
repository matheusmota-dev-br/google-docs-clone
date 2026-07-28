import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Document, Prisma } from "@repo/db";

import type { AuthUser } from "../auth/auth-user";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateDocumentDto } from "./dto/create-document.dto";
import type { ListDocumentsDto } from "./dto/list-documents.dto";
import type { UpdateDocumentDto } from "./dto/update-document.dto";

/** Shape returned to clients — never leaks the binary Yjs state. */
export interface DocumentView {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  organizationId: string | null;
  initialContent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const toView = (document: Document): DocumentView => ({
  id: document.id,
  title: document.title,
  ownerId: document.ownerId,
  ownerName: document.ownerName,
  organizationId: document.organizationId,
  initialContent: document.initialContent,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * A document is reachable when you created it, or when it belongs to a
   * Keycloak group you are a member of. Membership always comes from the
   * token, never from a request parameter.
   */
  static canAccess(document: Document, user: AuthUser): boolean {
    if (document.ownerId === user.id) return true;

    return (
      document.organizationId !== null &&
      user.organizations.includes(document.organizationId)
    );
  }

  private assertMemberOf(organizationId: string | undefined, user: AuthUser) {
    if (organizationId && !user.organizations.includes(organizationId)) {
      throw new ForbiddenException(`You are not a member of "${organizationId}"`);
    }
  }

  async list(query: ListDocumentsDto, user: AuthUser) {
    const { search, organizationId, cursor, limit = 5 } = query;
    this.assertMemberOf(organizationId, user);

    const where: Prisma.DocumentWhereInput = organizationId
      ? { organizationId }
      : { ownerId: user.id, organizationId: null };

    if (search?.trim()) {
      where.title = { contains: search.trim(), mode: "insensitive" };
    }

    // One extra row tells us whether another page exists without a count query.
    const rows = await this.prisma.document.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = rows.slice(0, limit);

    return {
      items: items.map(toView),
      nextCursor: rows.length > limit ? (items.at(-1)?.id ?? null) : null,
    };
  }

  async findOne(id: string, user: AuthUser): Promise<DocumentView> {
    const document = await this.prisma.document.findUnique({ where: { id } });

    if (!document) throw new NotFoundException("Document not found");
    if (!DocumentsService.canAccess(document, user)) {
      throw new ForbiddenException("You do not have access to this document");
    }

    return toView(document);
  }

  /**
   * Titles for a set of ids, used by the editor to label cross-document
   * references. Documents the caller cannot see are reported as removed rather
   * than 403, so one stale reference does not fail the whole lookup.
   */
  async findManyByIds(ids: string[], user: AuthUser) {
    const documents = await this.prisma.document.findMany({ where: { id: { in: ids } } });
    const byId = new Map(documents.map((document) => [document.id, document]));

    return ids.map((id) => {
      const document = byId.get(id);

      return document && DocumentsService.canAccess(document, user)
        ? { id, name: document.title }
        : { id, name: "[Removed]" };
    });
  }

  async create(dto: CreateDocumentDto, user: AuthUser): Promise<DocumentView> {
    this.assertMemberOf(dto.organizationId, user);

    const document = await this.prisma.document.create({
      data: {
        title: dto.title?.trim() || "Untitled document",
        initialContent: dto.initialContent ?? null,
        organizationId: dto.organizationId ?? null,
        ownerId: user.id,
        ownerName: user.name,
      },
    });

    return toView(document);
  }

  async update(
    id: string,
    dto: UpdateDocumentDto,
    user: AuthUser,
  ): Promise<DocumentView> {
    await this.findOne(id, user);

    const document = await this.prisma.document.update({
      where: { id },
      data: { title: dto.title.trim() || "Untitled document" },
    });

    return toView(document);
  }

  async remove(id: string, user: AuthUser): Promise<void> {
    await this.findOne(id, user);
    await this.prisma.document.delete({ where: { id } });
  }
}
