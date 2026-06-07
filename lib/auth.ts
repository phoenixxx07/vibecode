import NextAuth from "next-auth";

import Google from "next-auth/providers/google";

import { UserRole } from "@prisma/client";

import { authConfig } from "./auth.config";

import { prisma } from "./prisma";

import { PrismaAuthAdapter } from "./prisma-auth-adapter";



const userSelect = {

  id: true,

  role: true,

  name: true,

  email: true,

  avatarUrl: true,

} as const;



async function syncTokenFromDb(token: Record<string, unknown>, userId: string) {

  const dbUser = await prisma.user.findUnique({

    where: { id: userId },

    select: userSelect,

  });



  if (dbUser) {
    token.id = dbUser.id;
    token.role = dbUser.role;
    token.name = dbUser.name;
    token.email = dbUser.email;
    token.picture = dbUser.avatarUrl;
  } else {
    token.role = UserRole.user;
  }
}



const seedAdminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: process.env.AUTH_DEBUG === "true",
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  adapter: PrismaAuthAdapter(),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  events: {
    async signIn({ user, account, isNewUser }) {
      console.info("[auth] signIn ok", {
        userId: user.id,
        provider: account?.provider,
        isNewUser,
      });
    },
  },

  callbacks: {
    ...authConfig.callbacks,

    async signIn() {
      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if (user.image) token.picture = user.image;

        try {
          if (
            seedAdminEmail &&
            user.email?.trim().toLowerCase() === seedAdminEmail
          ) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: UserRole.admin },
            });
          }
          await syncTokenFromDb(token, user.id);
        } catch (error) {
          console.error("[auth] jwt callback db sync failed", {
            userId: user.id,
            error,
          });
          token.role = token.role ?? UserRole.user;
        }
      } else if (trigger === "update" && typeof token.id === "string") {
        try {
          await syncTokenFromDb(token, token.id);
        } catch (error) {
          console.error("[auth] jwt update sync failed", {
            userId: token.id,
            error,
          });
        }
      }

      return token;
    },
  },
});



export function resolvePostLoginRedirect(

  role: string | undefined,

  callbackUrl?: string

) {

  if (callbackUrl && callbackUrl !== "/dashboard") {

    return callbackUrl;

  }

  if (role === UserRole.admin) return "/admin";

  return callbackUrl ?? "/dashboard";

}



export async function requireAuth() {

  const session = await auth();

  if (!session?.user?.id) {

    throw new Error("Unauthorized");

  }

  return session;

}



export async function requireAdmin() {

  const session = await requireAuth();

  if (session.user.role !== UserRole.admin) {

    throw new Error("Forbidden");

  }

  return session;

}

