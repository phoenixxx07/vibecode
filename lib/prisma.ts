import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;

  // Next.js HMR can keep a PrismaClient from before schema changes (missing new delegates).
  if (cached && typeof cached.metadataOption?.findMany !== "function") {
    void cached.$disconnect().catch(() => {});
    return createPrismaClient();
  }

  return cached ?? createPrismaClient();
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
