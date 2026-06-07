import { Prisma, ProductStatus } from "@prisma/client";
import { normalizePagination } from "./pagination";
import { prisma } from "./prisma";

export type ProductFilters = {
  q?: string;
  projectType?: string | string[];
  categorySlug?: string | string[];
  aiToolId?: string | string[];
  platform?: string | string[];
  pricingType?: string;
  status?: ProductStatus;
  userId?: string;
  sort?: "newest" | "popular";
  page?: number;
  limit?: number;
};

export function parseFilterValues(value?: string | string[]): string[] | undefined {
  if (!value) return undefined;
  const items = (Array.isArray(value) ? value : [value])
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}

export const productInclude = {
  user: {
    select: { id: true, name: true, email: true, avatarUrl: true, socialLink: true },
  },
  categories: { include: { category: true } },
  aiTools: { include: { aiTool: true } },
} satisfies Prisma.ProductInclude;

type ProductWithInclude = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function serializeProduct(product: ProductWithInclude) {
  return {
    ...product,
    priceAmount: product.priceAmount != null ? Number(product.priceAmount) : null,
  };
}

export async function getProducts(filters: ProductFilters = {}) {
  const {
    q,
    projectType,
    categorySlug,
    aiToolId,
    platform,
    pricingType,
    status = ProductStatus.approved,
    userId,
    sort = "newest",
    page: rawPage,
    limit: rawLimit,
  } = filters;

  const { page, limit } = normalizePagination(rawPage, rawLimit);

  const projectTypes = parseFilterValues(projectType);
  const categorySlugs = parseFilterValues(categorySlug);
  const aiToolIds = parseFilterValues(aiToolId);
  const platforms = parseFilterValues(platform);

  const where: Prisma.ProductWhereInput = {
    status,
    ...(userId && { userId }),
    ...(projectTypes && { projectType: { in: projectTypes } }),
    ...(pricingType && { pricingType }),
    ...(platforms && { platforms: { hasSome: platforms } }),
    ...(categorySlugs && {
      categories: { some: { category: { slug: { in: categorySlugs } } } },
    }),
    ...(aiToolIds && {
      aiTools: { some: { aiToolId: { in: aiToolIds } } },
    }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { tagline: { contains: q, mode: "insensitive" } },
        { highlight1: { contains: q, mode: "insensitive" } },
        { highlight2: { contains: q, mode: "insensitive" } },
        { highlight3: { contains: q, mode: "insensitive" } },
        { categories: { some: { category: { name: { contains: q, mode: "insensitive" } } } } },
        { aiTools: { some: { aiTool: { name: { contains: q, mode: "insensitive" } } } } },
      ],
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy:
        sort === "popular"
          ? [
              { upvoteCount: "desc" },
              { clickCount: "desc" },
              { viewCount: "desc" },
              { createdAt: "desc" },
            ]
          : { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(serializeProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  return product ? serializeProduct(product) : null;
}

export async function getCatalogStats() {
  const [productCount, builderCount, categoryCount] = await Promise.all([
    prisma.product.count({ where: { status: ProductStatus.approved } }),
    prisma.user.count({
      where: {
        products: { some: { status: ProductStatus.approved } },
      },
    }),
    prisma.category.count(),
  ]);

  return { productCount, builderCount, categoryCount };
}

const DEFAULT_PRICING_LABELS: Record<string, string> = {
  free: "Gratis",
  freemium: "Freemium",
  paid: "Berbayar",
  contact_for_price: "Hubungi developer",
};

const DEFAULT_PROJECT_TYPE_LABELS: Record<string, string> = {
  live: "LIVE",
  prototype: "PROTOTYPE",
  repository: "REPOSITORY",
};

const DEFAULT_PROJECT_TYPE_CTAS: Record<string, string> = {
  live: "[VISIT_LIVE]",
  prototype: "[TRY_PROTOTYPE]",
  repository: "[VIEW_REPO]",
};

export function formatPricing(
  product: {
    pricingType: string | null;
    priceAmount: Prisma.Decimal | number | null;
    priceCurrency: string | null;
    pricingNote: string | null;
  },
  pricingLabels: Record<string, string> = DEFAULT_PRICING_LABELS
): string {
  if (product.pricingNote) return product.pricingNote;
  if (product.priceAmount) {
    const currency = product.priceCurrency ?? "IDR";
    const amount = Number(product.priceAmount).toLocaleString("id-ID");
    return currency === "IDR" ? `Rp ${amount}` : `${currency} ${amount}`;
  }
  if (product.pricingType && pricingLabels[product.pricingType]) {
    return pricingLabels[product.pricingType];
  }
  return "Hubungi developer";
}

export function getProjectTypeLabel(
  type: string,
  labels: Record<string, string> = DEFAULT_PROJECT_TYPE_LABELS
): string {
  return labels[type] ?? type.toUpperCase();
}

export function getPrimaryCta(
  type: string,
  ctas: Record<string, string> = DEFAULT_PROJECT_TYPE_CTAS
): { label: string; action: "visit" } {
  return { label: ctas[type] ?? "[VISIT]", action: "visit" };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getDeveloperEmail(
  developerContact: string,
  userEmail: string
): string {
  const contact = developerContact.trim();
  if (EMAIL_PATTERN.test(contact)) return contact;
  return userEmail;
}
