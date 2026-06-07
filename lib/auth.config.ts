import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        if (user.role) token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole | undefined) ?? "user";
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        return `${baseUrl}/auth/complete`;
      }
      return `${baseUrl}/auth/complete`;
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig;
