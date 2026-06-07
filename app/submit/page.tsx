import { SubmitForm } from "@/components/submit/SubmitForm";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { auth } from "@/lib/auth";
import { getFormMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/submit");
  const { categories, aiTools, platforms, projectTypes, pricingTypes } =
    await getFormMetadata();

  const defaultContact = session?.user?.email ?? "";

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-xl font-bold uppercase text-primary">&gt; VIBE_INDEX</h1>
        <p className="mb-8 text-sm text-muted">
          Submit proyek live, prototype, atau repository. Harga opsional — pemesanan langsung ke kontak Anda.
        </p>
        <SubmitForm
          categories={categories}
          aiTools={aiTools}
          platforms={platforms}
          projectTypes={projectTypes}
          pricingTypes={pricingTypes}
          defaultContact={defaultContact}
        />
      </main>
    </div>
  );
}
