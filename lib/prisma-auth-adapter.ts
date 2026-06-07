import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterAccount, AdapterUser } from "@auth/core/adapters";
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

function toPrismaUserCreateData(
  data: Record<string, unknown>
): Prisma.UserUncheckedCreateInput {
  const email = data.email;
  if (typeof email !== "string" || !email.trim()) {
    throw new Error("OAuth profile missing email");
  }

  return {
    email: email.trim().toLowerCase(),
    ...(typeof data.name === "string" || data.name === null
      ? { name: data.name }
      : {}),
    ...(data.image !== undefined ? { avatarUrl: data.image as string | null } : {}),
  };
}

function toPrismaUserUpdateData(
  data: Record<string, unknown>
): Prisma.UserUncheckedUpdateInput {
  return {
    ...(typeof data.name === "string" || data.name === null
      ? { name: data.name }
      : {}),
    ...(typeof data.email === "string" ? { email: data.email.trim().toLowerCase() } : {}),
    ...(data.image !== undefined ? { avatarUrl: data.image as string | null } : {}),
  };
}

function toPrismaAccountData(
  data: Record<string, unknown>
): Prisma.AccountUncheckedCreateInput {
  const userId = data.userId;
  const type = data.type;
  const provider = data.provider;
  const providerAccountId = data.providerAccountId;

  if (
    typeof userId !== "string" ||
    typeof type !== "string" ||
    typeof provider !== "string" ||
    typeof providerAccountId !== "string"
  ) {
    throw new Error("Invalid OAuth account payload");
  }

  return {
    userId,
    type,
    provider,
    providerAccountId,
    refresh_token: (data.refresh_token as string | null | undefined) ?? null,
    access_token: (data.access_token as string | null | undefined) ?? null,
    expires_at:
      typeof data.expires_at === "number" ? Math.trunc(data.expires_at) : null,
    token_type: (data.token_type as string | null | undefined) ?? null,
    scope: (data.scope as string | null | undefined) ?? null,
    id_token: (data.id_token as string | null | undefined) ?? null,
    session_state: (data.session_state as string | null | undefined) ?? null,
  };
}

export function PrismaAuthAdapter(): Adapter {
  const base = PrismaAdapter(prisma);

  return {
    ...base,
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: toPrismaUserCreateData(data),
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
        data: toPrismaUserUpdateData(data),
      });
      return toAdapterUser(user);
    },
    linkAccount: async (data) => {
      const account = await prisma.account.create({
        data: toPrismaAccountData(data),
      });
      return account as AdapterAccount;
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
