import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RequestsRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.type) sp.set("type", params.type);
  if (params.category) sp.set("category", params.category);
  if (params.page) sp.set("page", params.page);
  const qs = sp.toString();
  redirect(`/catalog/requests${qs ? `?${qs}` : ""}`);
}
