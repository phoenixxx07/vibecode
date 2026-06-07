import { auth, resolvePostLoginRedirect } from "@/lib/auth";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ callbackUrl?: string }>;

export default async function AuthCompletePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  redirect(resolvePostLoginRedirect(session.user.role, params.callbackUrl));
}
