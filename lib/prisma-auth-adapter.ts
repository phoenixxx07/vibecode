import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterAccount, AdapterUser } from "@auth/core/adapters";
import type { Prisma, User } from "@prisma/client";
import { prisma } from "./prisma";

function isPrismaUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email?.trim()) return null;
  return email.trim().toLowerCase();
}

function toAdapterUser(user: User): AdapterUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.avatarUrl,
    emailVerified: null,
  };
}

type OAuthUserInput = Omit<AdapterUser, "id"> & {
  picture?: string | null;
};

function resolveAvatarUrl(data: OAuthUserInput): string | null | undefined {
  if (data.image !== undefined) return data.image;
  if (data.picture !== undefined) return data.picture;
  return undefined;
}

function toPrismaUserCreateData(data: OAuthUserInput): Prisma.UserUncheckedCreateInput {
  const email = normalizeEmail(data.email);
  if (!email) {
    throw new Error("OAuth profile missing email");
  }

  const avatarUrl = resolveAvatarUrl(data);

  return {
    email,
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  };
}

function toPrismaUserUpdateData(
  data: Partial<AdapterUser> & { picture?: string | null }
): Prisma.UserUncheckedUpdateInput {
  const avatarUrl = resolveAvatarUrl(data as OAuthUserInput);

  return {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(typeof data.email === "string"
      ? { email: normalizeEmail(data.email) ?? data.email }
      : {}),
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  };
}

function toPrismaAccountData(
  data: AdapterAccount
): Prisma.AccountUncheckedCreateInput {
  return {
    userId: data.userId,
    type: data.type,
    provider: data.provider,
    providerAccountId: data.providerAccountId,
    refresh_token: data.refresh_token ?? null,
    access_token: data.access_token ?? null,
    expires_at:
      typeof data.expires_at === "number" ? Math.trunc(data.expires_at) : null,
    token_type: data.token_type ?? null,
    scope: data.scope ?? null,
    id_token: data.id_token ?? null,
    session_state:
      typeof data.session_state === "string" ? data.session_state : null,
  };
}

export function PrismaAuthAdapter(): Adapter {
  const base = PrismaAdapter(prisma);

  return {
    ...base,
    createUser: async (data) => {
      try {
        const user = await prisma.user.create({
          data: toPrismaUserCreateData(data),
        });
        return toAdapterUser(user);
      } catch (error) {
        if (isPrismaUniqueViolation(error)) {
          const email = normalizeEmail(data.email);
          if (email) {
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) return toAdapterUser(existing);
          }
        }
        console.error("[auth][adapter] createUser failed", error);
        throw error;
      }
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? toAdapterUser(user) : null;
    },
    getUserByEmail: async (email) => {
      const normalized = normalizeEmail(email);
      if (!normalized) return null;
      const user = await prisma.user.findUnique({ where: { email: normalized } });
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
      try {
        const account = await prisma.account.create({
          data: toPrismaAccountData(data),
        });
        return account as AdapterAccount;
      } catch (error) {
        if (isPrismaUniqueViolation(error)) {
          const existing = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: data.provider,
                providerAccountId: data.providerAccountId,
              },
            },
          });
          if (existing) return existing as AdapterAccount;
        }
        console.error("[auth][adapter] linkAccount failed", {
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          userId: data.userId,
          error,
        });
        throw error;
      }
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
