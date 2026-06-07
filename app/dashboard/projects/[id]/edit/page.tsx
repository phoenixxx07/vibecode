import { ProjectEditor } from "@/components/dashboard/ProjectEditor";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { auth } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { getFormMetadata } from "@/lib/metadata";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  if (product.userId !== session.user.id && session.user.role !== "admin") {
    redirect("/dashboard/projects");
  }

  const { categories, aiTools, platforms, projectTypes, pricingTypes } =
    await getFormMetadata();

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-4 text-xl font-bold uppercase text-primary">
          &gt; EDIT_NODE: {product.name}
        </h1>
        <div className="mb-8 grid grid-cols-2 gap-4 border border-muted bg-surface p-4 sm:max-w-xs">
          <div>
            <p className="text-xs uppercase text-muted">Views</p>
            <p className="text-xl font-bold text-primary">{product.viewCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted">Clicks</p>
            <p className="text-xl font-bold text-primary">{product.clickCount}</p>
          </div>
        </div>
        <ProjectEditor
          product={product}
          categories={categories}
          aiTools={aiTools}
          platforms={platforms}
          projectTypes={projectTypes}
          pricingTypes={pricingTypes}
        />
      </main>
    </div>
  );
}
