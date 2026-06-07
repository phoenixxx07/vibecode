import { notFound } from "next/navigation";

import { ProductCard } from "@/components/catalog/ProductCard";

import { TerminalHeader } from "@/components/terminal/TerminalHeader";

import { TerminalPagination } from "@/components/terminal/TerminalPagination";

import { getProducts } from "@/lib/products";

import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";

import { prisma } from "@/lib/prisma";



export const dynamic = "force-dynamic";



type SearchParams = Promise<{ page?: string }>;



export default async function CategoryPage({

  params,

  searchParams,

}: {

  params: Promise<{ slug: string }>;

  searchParams: SearchParams;

}) {

  const { slug } = await params;

  const query = await searchParams;

  const page = Number(query.page ?? 1);



  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) notFound();



  const { products, total, totalPages } = await getProducts({

    categorySlug: slug,

    page,

  }).catch(() => ({

    products: [],

    total: 0,

    page: 1,

    limit: DEFAULT_PAGE_SIZE,

    totalPages: 0,

  }));



  return (

    <div className="min-h-screen">

      <TerminalHeader />

      <main className="mx-auto max-w-7xl px-4 py-8">

        <h1 className="text-2xl font-bold uppercase text-primary">

          &gt; {category.name}

        </h1>

        <p className="mt-2 text-sm text-muted">{total} proyek dalam kategori ini</p>



        {products.length > 0 ? (

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {products.map((product) => (

              <ProductCard key={product.id} product={product} />

            ))}

          </div>

        ) : (

          <div className="mt-8 border border-muted bg-surface p-12 text-center text-muted">

            <p className="text-sm uppercase">Tidak ada proyek dalam kategori ini</p>

          </div>

        )}



        <TerminalPagination

          basePath={`/catalog/${slug}`}

          params={query}

          page={page}

          totalPages={totalPages}

        />

      </main>

    </div>

  );

}


