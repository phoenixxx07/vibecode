import Link from "next/link";
import { AppLogo } from "@/components/brand/AppLogo";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { ProjectRequestCard } from "@/components/requests/ProjectRequestCard";
import { getMetadataLabels } from "@/lib/metadata";
import { getPublicProjectRequests } from "@/lib/project-requests";
import { getCatalogStats, getProducts } from "@/lib/products";
import { ProjectRequestStatus } from "@prisma/client";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ products }, stats, { items: openRequests }, projectTypeLabels] =
    await Promise.all([
      getProducts({ limit: 6, sort: "popular" }),
      getCatalogStats().catch(() => ({
        productCount: 0,
        builderCount: 0,
        categoryCount: 0,
      })),
      getPublicProjectRequests({
        status: ProjectRequestStatus.published,
        limit: 3,
      }).catch(() => ({ items: [] })),
      getMetadataLabels("project_type"),
    ]);

  return (
    <div className="min-h-screen">
      <TerminalHeader />

      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="border border-muted bg-surface p-8 md:p-12">
          <AppLogo href={null} size={88} showText={false} className="mb-6" priority />

          <h1 className="blinking-cursor text-2xl font-bold uppercase text-text-main md:text-4xl">
            Katalog Vibe Coder Indonesia
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">
            Direktori murni tools & proyek buatan vibe coder lokal. Daftarkan proyek{" "}
            <span className="text-primary">live</span>,{" "}
            <span className="text-primary">prototype</span>, atau{" "}
            <span className="text-primary">repository GitHub</span>.
            Pemesanan langsung ke developer — bukan marketplace.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <TerminalButton href="/catalog" variant="primary">
              [BROWSE_CATALOG]
            </TerminalButton>
            <TerminalButton href="/submit" variant="ghost">
              [SUBMIT_PROJECT]
            </TerminalButton>
            <TerminalButton href="/catalog/requests" variant="ghost">
              [KATALOG_REQUEST]
            </TerminalButton>
            <TerminalButton href="/search" variant="ghost">
              [SEARCH]
            </TerminalButton>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-3 gap-4 border border-muted bg-surface p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.productCount}</p>
            <p className="text-xs uppercase text-muted">Proyek</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.builderCount}</p>
            <p className="text-xs uppercase text-muted">Builder</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.categoryCount}</p>
            <p className="text-xs uppercase text-muted">Kategori</p>
          </div>
        </section>

        {openRequests.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase text-primary">
                &gt; OPEN_REQUESTS
              </h2>
              <Link
                href="/catalog/requests"
                className="text-xs uppercase text-muted hover:text-primary"
              >
                [LIHAT_SEMUA]
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {openRequests.map((request) => (
                <ProjectRequestCard
                  key={request.id}
                  request={request}
                  projectTypeLabels={projectTypeLabels}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold uppercase text-primary">&gt; POPULAR_NODES</h2>
            <Link href="/catalog" className="text-xs uppercase text-muted hover:text-primary">
              [VIEW_ALL]
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="border border-muted bg-surface p-8 text-center text-muted">
              <p>Database belum terhubung atau katalog masih kosong.</p>
              <p className="mt-2 text-xs">Jalankan migrasi dan seed untuk memulai.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
