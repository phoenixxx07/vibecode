"use server";

import { signIn } from "@/lib/auth";
import { buildAuthCallbackUrl } from "@/lib/auth-redirect";

export async function signInWithGoogle(formData: FormData) {
  const callbackUrl = buildAuthCallbackUrl(
    (formData.get("callbackUrl") as string | null) ?? undefined
  );

  // Jangan try/catch — signIn melempar NEXT_REDIRECT ke Google OAuth.
  await signIn("google", { redirectTo: callbackUrl });
}
