import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { UpvoteButton } from "@/components/catalog/UpvoteButton";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { auth } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { absoluteScreenshotUrl } from "@/lib/thumio";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Proyek tidak ditemukan" };

  const ogImage = absoluteScreenshotUrl(product.screenshotUrl);

  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;
  const [product, session] = await Promise.all([
    getProductById(id),
    auth(),
  ]);

  if (!product || product.status !== "approved") notFound();

  await prisma.product.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  let hasUpvoted = false;
  if (session?.user?.id) {
    const upvote = await prisma.upvote.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: id,
        },
      },
    });
    hasUpvoted = !!upvote;
  }

  return (
    <div className="min-h-screen">
      <TerminalHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <UpvoteButton
            productId={id}
            initialCount={product.upvoteCount}
            hasUpvoted={hasUpvoted}
            isLoggedIn={!!session?.user}
          />
        </div>
        <ProductDetail product={product} />
      </main>
    </div>
  );
}
