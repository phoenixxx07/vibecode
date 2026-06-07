import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterUser } from "@auth/core/adapters";
import type { Prisma, User } from "@prisma/client";
import { prisma } from "./prisma";

function toAdapterUser(user: User): AdapterUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.avatarUrl,
    emailVerified: null,
  };
}

function toPrismaUserData(
  data: Record<string, unknown>
): Prisma.UserUncheckedCreateInput {
  const { image, emailVerified, id, ...rest } = data;
  return {
    ...(rest as Prisma.UserUncheckedCreateInput),
    ...(image !== undefined ? { avatarUrl: image as string | null } : {}),
  };
}

export function PrismaAuthAdapter(): Adapter {
  const base = PrismaAdapter(prisma);

  return {
    ...base,
    createUser: async (data) => {
      const { id, ...rest } = data;
      const user = await prisma.user.create({
        data: toPrismaUserData(rest),
      });
      return toAdapterUser(user);
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? toAdapterUser(user) : null;
    },
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? toAdapterUser(user) : null;
    },
    async getUserByAccount(provider_providerAccountId) {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId },
        include: { user: true },
      });
      return account?.user ? toAdapterUser(account.user) : null;
    },
    updateUser: async ({ id, ...data }) => {
      const user = await prisma.user.update({
        where: { id },
        data: toPrismaUserData(data),
      });
      return toAdapterUser(user);
    },
    async getSessionAndUser(sessionToken) {
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user: toAdapterUser(user), session };
    },
  };
}
