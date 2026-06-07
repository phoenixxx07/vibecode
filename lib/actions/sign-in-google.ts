"use server";

import { signIn } from "@/lib/auth";
import { buildAuthCallbackUrl } from "@/lib/auth-redirect";

export async function signInWithGoogle(callbackUrl?: string): Promise<string> {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum diset");
  }

  const redirectTo = buildAuthCallbackUrl(callbackUrl);
  const url = await signIn("google", { redirectTo, redirect: false });
  if (!url || typeof url !== "string") {
    throw new Error("Google sign-in URL tidak tersedia");
  }
  return url;
}
