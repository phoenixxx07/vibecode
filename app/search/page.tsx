import { ProductCard } from "@/components/catalog/ProductCard";
import { ProjectRequestCard } from "@/components/requests/ProjectRequestCard";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { TerminalSearchBar } from "@/components/terminal/TerminalSearchBar";
import { TerminalPagination } from "@/components/terminal/TerminalPagination";
import { getMetadataLabels } from "@/lib/metadata";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { getProducts } from "@/lib/products";
import { getPublicProjectRequests } from "@/lib/project-requests";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; page?: string }>;

const emptyProducts = {
  products: [],
  total: 0,
  totalPages: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
};

const emptyRequests = {
  items: [],
  total: 0,
  totalPages: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Number(params.page ?? 1);

  const [result, requestResult, projectTypeLabels] = q
    ? await Promise.all([
        getProducts({ q, page }).catch(() => emptyProducts),
        getPublicProjectRequests({ q, page }).catch(() => emptyRequests),
        getMetadataLabels("project_type"),
      ])
    : [emptyProducts, emptyRequests, {} as Record<string, string>];

  const totalResults = result.total + requestResult.total;
  const totalPages = Math.max(result.totalPages, requestResult.totalPages);
  const hasResults = result.products.length > 0 || requestResult.items.length > 0;

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold uppercase text-primary">
          &gt; SEARCH_RESULTS
        </h1>

        <div className="mb-8 max-w-xl">
          <TerminalSearchBar defaultValue={q} />
        </div>

        {q ? (
          <>
            <p className="mb-6 text-sm text-muted">
              {totalResults} hasil untuk &quot;{q}&quot;
              {totalResults > 0 && (
                <>
                  {" "}
                  · {result.total} proyek · {requestResult.total} request
                </>
              )}
            </p>

            {hasResults ? (
              <div className="space-y-10">
                {result.products.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-sm font-bold uppercase text-primary">
                      &gt; PROYEK ({result.total})
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {result.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )}

                {requestResult.items.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-sm font-bold uppercase text-primary">
                      &gt; REQUEST ({requestResult.total})
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {requestResult.items.map((request) => (
                        <ProjectRequestCard
                          key={request.id}
                          request={request}
                          projectTypeLabels={projectTypeLabels}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="border border-muted bg-surface p-8 text-center text-muted">
                Tidak ada proyek atau request yang cocok. Coba kata kunci lain.
              </div>
            )}

            {totalPages > 1 && (
              <TerminalPagination
                basePath="/search"
                params={params}
                page={page}
                totalPages={totalPages}
              />
            )}
          </>
        ) : (
          <p className="text-sm text-muted">
            Masukkan kata kunci untuk mencari tools, proyek, & request.
          </p>
        )}
      </main>
    </div>
  );
}

