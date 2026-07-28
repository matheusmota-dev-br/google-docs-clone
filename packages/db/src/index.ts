import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";
export * from "./access";
export { PrismaClient };

declare global {
  var __prisma: PrismaClient | undefined;
}

/**
 * One client per process. The global cache keeps `tsx watch` and Next.js hot
 * reloads from opening a new connection pool on every rebuild.
 */
export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
