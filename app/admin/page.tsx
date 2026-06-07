import { AdminCatalogPanel } from "@/components/admin/AdminCatalogPanel";
import { AdminMetadataPanel } from "@/components/admin/AdminMetadataPanel";
import { AdminMetadataRequestPanel } from "@/components/admin/AdminMetadataRequestPanel";
import { AdminReviewPanel } from "@/components/admin/AdminReviewPanel";
import { AdminUsersPanel } from "@/components/admin/AdminUsersPanel";
import { TerminalDisclosure } from "@/components/terminal/TerminalDisclosure";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { getAdminUsers } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { getAdminMetadata, getMetadataLabels } from "@/lib/metadata";
import { AdminApprovedProjectRequestPanel } from "@/components/admin/AdminApprovedProjectRequestPanel";
import { AdminProjectRequestPanel } from "@/components/admin/AdminProjectRequestPanel";
import { getPendingMetadataRequests } from "@/lib/metadata-requests";
import { getApprovedProjectRequests, getPendingProjectRequests } from "@/lib/project-requests";
import { getProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    redirect("/login");
  }

  const [
    { products: pending },
    { products: approvedProducts },
    allProducts,
    approvedCount,
    metadata,
    metadataRequests,
    projectRequests,
    approvedProjectRequests,
    projectTypeLabels,
    users,
  ] = await Promise.all([
    getProducts({ status: ProductStatus.pending, limit: 50 }),
    getProducts({ status: ProductStatus.approved, limit: 100 }),
    prisma.product.count(),
    prisma.product.count({ where: { status: ProductStatus.approved } }),
    getAdminMetadata(),
    getPendingMetadataRequests(),
    getPendingProjectRequests(),
    getApprovedProjectRequests(),
    getMetadataLabels("project_type"),
    getAdminUsers(),
  ]);

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-xl font-bold uppercase text-primary">&gt; ADMIN_PANEL</h1>
        <p className="mt-1 text-sm text-muted">Kurasi submission & kelola katalog</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Users", value: users.length },
            { label: "Pending", value: pending.length },
            { label: "Approved", value: approvedCount },
            { label: "Total Proyek", value: allProducts },
            { label: "AI Tools", value: metadata.aiTools.length },
          ].map((s) => (
            <div key={s.label} className="border border-muted bg-surface p-4">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-xs uppercase text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-12">
        <TerminalDisclosure title={`Review Queue (${pending.length} pending)`} defaultOpen>
          <AdminReviewPanel products={pending} />
        </TerminalDisclosure>

          <TerminalDisclosure title={`Katalog Disetujui (${approvedCount})`}>
            <p className="mb-4 text-xs text-muted">
              Lihat dan edit proyek yang sudah live di katalog.
            </p>
            <AdminCatalogPanel products={approvedProducts} />
          </TerminalDisclosure>

          <TerminalDisclosure title={`Users Terdaftar (${users.length})`}>
            <p className="mb-4 text-xs text-muted">
              Daftar semua user yang login via Google OAuth.
            </p>
            <AdminUsersPanel users={users} currentAdminId={session.user.id} />
          </TerminalDisclosure>

          <AdminProjectRequestPanel
            requests={projectRequests}
            projectTypeLabels={projectTypeLabels}
          />

          <AdminApprovedProjectRequestPanel
            requests={approvedProjectRequests}
            projectTypeLabels={projectTypeLabels}
          />

          <AdminMetadataRequestPanel requests={metadataRequests} />

          <AdminMetadataPanel
            categories={metadata.categories}
            aiTools={metadata.aiTools}
            platforms={metadata.platforms}
            projectTypes={metadata.projectTypes}
            pricingTypes={metadata.pricingTypes}
          />
        </div>
      </main>
    </div>
  );
}
