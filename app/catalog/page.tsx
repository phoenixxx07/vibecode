import { Suspense } from "react";

import { CatalogNav } from "@/components/catalog/CatalogNav";
import { ProductCard } from "@/components/catalog/ProductCard";

import { FilterSidebar } from "@/components/catalog/FilterSidebar";

import { TerminalHeader } from "@/components/terminal/TerminalHeader";

import { TerminalPagination } from "@/components/terminal/TerminalPagination";

import { getProducts } from "@/lib/products";

import { getFormMetadata } from "@/lib/metadata";

import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";



export const dynamic = "force-dynamic";



type SearchParams = Promise<{

  type?: string;

  category?: string;

  aiTool?: string;

  platform?: string;

  sort?: string;

  page?: string;

}>;



export default async function CatalogPage({

  searchParams,

}: {

  searchParams: SearchParams;

}) {

  const params = await searchParams;

  const page = Number(params.page ?? 1);



  const [metadata, { products, totalPages, total }] = await Promise.all([

    getFormMetadata(),

    getProducts({

      projectType: params.type,

      categorySlug: params.category,

      aiToolId: params.aiTool,

      platform: params.platform,

      sort: (params.sort as "newest" | "popular") ?? "newest",

      page,

    }).catch(() => ({

      products: [],

      totalPages: 0,

      total: 0,

      page: 1,

      limit: DEFAULT_PAGE_SIZE,

    })),

  ]);



  return (

    <div className="min-h-screen">

      <TerminalHeader showSearch={false} />



      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">

        <Suspense fallback={<div className="h-64 w-64 border border-muted bg-surface" />}>

          <FilterSidebar

            categories={metadata.categories}

            aiTools={metadata.aiTools}

            projectTypes={metadata.projectTypes}

            platforms={metadata.platforms}

          />

        </Suspense>



        <main className="flex-1">

          <CatalogNav active="products" />

          <div className="mb-6 flex items-center justify-between border-b border-muted pb-4">

            <div>

              <h1 className="text-xl font-bold uppercase text-primary">&gt; CATALOG_INDEX</h1>

              <p className="text-xs text-muted">{total} nodes found</p>

            </div>

          </div>



          {products.length > 0 ? (

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              {products.map((product) => (

                <ProductCard key={product.id} product={product} />

              ))}

            </div>

          ) : (

            <div className="border border-muted bg-surface p-12 text-center text-muted">

              <p className="text-sm uppercase">No nodes match current filters</p>

            </div>

          )}



          <TerminalPagination

            basePath="/catalog"

            params={params}

            page={page}

            totalPages={totalPages}

          />

        </main>

      </div>

    </div>

  );

}


