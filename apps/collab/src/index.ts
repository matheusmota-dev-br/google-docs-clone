import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import { canAccessDocument, prisma } from "@repo/db";

import { type CollabContext, verifyToken } from "./auth";
import { config } from "./config";
import { forgetDocument, mirrorThreadsToNotifications } from "./notifications";

const server = new Server<CollabContext>({
  port: config.port,
  name: "docs-collab",

  /**
   * Every socket presents the same Keycloak access token the REST API takes.
   * The token proves who you are; Postgres decides whether that person may
   * open this particular document.
   */
  async onAuthenticate({ token, documentName }) {
    const user = await verifyToken(token);

    const document = await prisma.document.findUnique({
      where: { id: documentName },
      select: { ownerId: true, organizationId: true },
    });

    if (!document) throw new Error("Document not found");
    if (!canAccessDocument(document, user)) {
      throw new Error("You do not have access to this document");
    }

    // Returned value becomes the connection's context.
    return { user } satisfies CollabContext;
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const row = await prisma.document.findUnique({
          where: { id: documentName },
          select: { state: true },
        });

        return row?.state ? Buffer.from(row.state) : null;
      },

      store: async ({ documentName, state }) => {
        await prisma.document.update({
          where: { id: documentName },
          // Node hands us a Buffer; Prisma's Bytes column wants a plain view.
          data: { state: new Uint8Array(state) },
        });
      },
    }),
  ],

  /**
   * Runs debounced, after the document has been persisted. Comments live in the
   * Y.Doc, so this is where they turn into inbox rows for people who are not
   * currently connected.
   */
  async afterStoreDocument({ documentName, document }) {
    try {
      await mirrorThreadsToNotifications(documentName, document);
    } catch (error) {
      console.error(`[collab] could not mirror comments of ${documentName}`, error);
    }
  },

  async afterUnloadDocument({ documentName }) {
    forgetDocument(documentName);
  },

  async onRequest({ response }) {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ status: "ok" }));

    // Resolving would let Hocuspocus write its own response on top of ours.
    return Promise.reject();
  },
});

void server.listen().then(() => {
  console.log(`[collab] Yjs server listening on ws://localhost:${config.port}`);
});

const shutdown = async () => {
  await server.destroy();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
