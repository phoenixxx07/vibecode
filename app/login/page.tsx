import { auth, resolvePostLoginRedirect } from "@/lib/auth";
import { buildAuthCallbackUrl } from "@/lib/auth-redirect";
import { AppLogo } from "@/components/brand/AppLogo";
import { GoogleSignInForm } from "@/components/auth/GoogleSignInForm";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { ThemeToggle } from "@/components/terminal/ThemeToggle";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ callbackUrl?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const session = await auth();

  if (session?.user?.id) {
    redirect(resolvePostLoginRedirect(session.user.role, params.callbackUrl));
  }

  const authCallbackUrl = buildAuthCallbackUrl(params.callbackUrl);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-page p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md border border-muted bg-surface p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <AppLogo href="/" size={48} showText={false} className="mb-4" />
          <h1 className="text-xl font-bold uppercase text-primary">&gt; AUTH_GATE</h1>
          <p className="mt-2 text-xs uppercase text-muted">developer access required</p>
        </div>

        <div className="mb-6 border border-muted bg-page p-4 text-xs text-muted">
          <p>&gt; STATUS: AWAITING_CREDENTIALS</p>
          <p>&gt; METHOD: GOOGLE_OAUTH</p>
          <p>&gt; ROLE: BUILDER / ADMIN</p>
        </div>

        {params.error && (
          <p className="mb-4 border border-red-500 p-3 text-xs text-red-400">
            Authentication failed. Please try again.
          </p>
        )}

        <GoogleSignInForm callbackUrl={authCallbackUrl}>
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center border border-primary bg-primary text-sm font-bold uppercase text-background-dark hover:bg-background-dark hover:text-primary"
          >
            [AUTH_GOOGLE]
          </button>
        </GoogleSignInForm>

        <div className="mt-6 text-center">
          <TerminalButton href="/" variant="ghost" className="text-xs">
            [RETURN_HOME]
          </TerminalButton>
        </div>
      </div>
    </div>
  );
}
