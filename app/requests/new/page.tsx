import { redirect } from "next/navigation";
import { ProjectRequestForm } from "@/components/requests/ProjectRequestForm";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { auth } from "@/lib/auth";
import { getFormMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export default async function NewRequestPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/requests/new");

  const { categories, projectTypes } = await getFormMetadata();

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-xl font-bold uppercase text-primary">&gt; AJUKAN_REQUEST</h1>
        <p className="mt-1 text-sm text-muted">Jenis & kategori mengikuti metadata katalog</p>
        <div className="mt-8">
          <ProjectRequestForm categories={categories} projectTypes={projectTypes} />
        </div>
      </main>
    </div>
  );
}
