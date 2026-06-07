import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { ProductStatus, ProjectRequestStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/catalog/requests`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const [products, requests] = await Promise.all([
      prisma.product.findMany({
        where: { status: ProductStatus.approved },
        select: { id: true, updatedAt: true, categories: { include: { category: true } } },
      }),
      prisma.projectRequest.findMany({
        where: {
          status: {
            in: [
              ProjectRequestStatus.published,
              ProjectRequestStatus.in_progress,
              ProjectRequestStatus.completed,
            ],
          },
        },
        select: { id: true, updatedAt: true },
      }),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/catalog/${p.categories[0]?.category.slug ?? "all"}/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const requestRoutes: MetadataRoute.Sitemap = requests.map((r) => ({
      url: `${baseUrl}/requests/${r.id}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    return [...staticRoutes, ...productRoutes, ...requestRoutes];
  } catch {
    return staticRoutes;
  }
}
