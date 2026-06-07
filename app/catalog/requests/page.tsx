import { Suspense } from "react";
import { CatalogNav } from "@/components/catalog/CatalogNav";
import { ProjectRequestCard } from "@/components/requests/ProjectRequestCard";
import { RequestFilterSidebar } from "@/components/requests/RequestFilterSidebar";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { TerminalPagination } from "@/components/terminal/TerminalPagination";
import { getFormMetadata, getMetadataLabels } from "@/lib/metadata";
import { getPublicProjectRequests } from "@/lib/project-requests";
import { ProjectRequestStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const VALID_STATUSES: ProjectRequestStatus[] = [
  ProjectRequestStatus.published,
  ProjectRequestStatus.in_progress,
  ProjectRequestStatus.completed,
];

type SearchParams = Promise<{
  status?: string;
  type?: string;
  category?: string;
  page?: string;
}>;

export default async function RequestCatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const status = VALID_STATUSES.includes(params.status as ProjectRequestStatus)
    ? (params.status as ProjectRequestStatus)
    : ProjectRequestStatus.published;
  const projectType = params.type || undefined;
  const categorySlug = params.category || undefined;

  const [metadata, projectTypeLabels, { items, total, totalPages }] = await Promise.all([
    getFormMetadata(),
    getMetadataLabels("project_type"),
    getPublicProjectRequests({
      status,
      projectType,
      categorySlug,
      page,
      limit: 12,
    }),
  ]);

  const { categories, projectTypes } = metadata;

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <Suspense fallback={<div className="h-64 w-full border border-muted bg-surface lg:w-64" />}>
          <RequestFilterSidebar categories={categories} projectTypes={projectTypes} />
        </Suspense>

        <main className="flex-1">
          <CatalogNav active="requests" />

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-muted pb-4">
            <div>
              <h1 className="text-xl font-bold uppercase text-primary">
                &gt; KATALOG_REQUEST
              </h1>
              <p className="text-xs text-muted">
                {total} request ditemukan · Developer bisa daftar & chat setelah login
              </p>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((request) => (
                <ProjectRequestCard
                  key={request.id}
                  request={request}
                  projectTypeLabels={projectTypeLabels}
                />
              ))}
            </div>
          ) : (
            <div className="border border-muted bg-surface p-12 text-center text-muted">
              <p className="text-sm uppercase">Tidak ada request pada filter ini</p>
              <p className="mt-2 text-xs">
                Coba ubah filter, atau ajukan request baru.
              </p>
            </div>
          )}

          <TerminalPagination
            basePath="/catalog/requests"
            params={{ status, type: projectType, category: categorySlug }}
            page={page}
            totalPages={totalPages}
          />
        </main>
      </div>
    </div>
  );
}
