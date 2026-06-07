import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProducts, parseFilterValues } from "@/lib/products";
import { normalizePagination } from "@/lib/pagination";
import { getProjectScreenshot } from "@/lib/thumio";
import { getMetadataValidationValues } from "@/lib/metadata";
import { buildProductSubmitSchema } from "@/lib/validators";
import { ProductStatus } from "@prisma/client";

const RATE_LIMIT = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const window = 60 * 60 * 1000;
  const max = 5;
  const timestamps = (RATE_LIMIT.get(userId) ?? []).filter((t) => now - t < window);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  RATE_LIMIT.set(userId, timestamps);
  return true;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  try {
    const { page, limit } = normalizePagination(
      Number(searchParams.get("page") ?? 1),
      Number(searchParams.get("limit") ?? undefined)
    );

    const result = await getProducts({
      q: searchParams.get("q") ?? undefined,
      projectType: parseFilterValues(searchParams.get("type") ?? undefined),
      categorySlug: parseFilterValues(searchParams.get("category") ?? undefined),
      aiToolId: parseFilterValues(searchParams.get("aiTool") ?? undefined),
      platform: parseFilterValues(searchParams.get("platform") ?? undefined),
      pricingType: searchParams.get("pricing") ?? undefined,
      status: (searchParams.get("status") as ProductStatus) ?? ProductStatus.approved,
      userId: searchParams.get("userId") ?? undefined,
      sort: (searchParams.get("sort") as "newest" | "popular") ?? "newest",
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 5 submissions per hour." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validationValues = await getMetadataValidationValues();
    const parsed = buildProductSubmitSchema(validationValues).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const screenshotUrl = getProjectScreenshot(
      data.projectType,
      data.url,
      data.githubUrl
    );

    const product = await prisma.product.create({
      data: {
        userId: session.user.id,
        name: data.name,
        tagline: data.tagline,
        url: data.url,
        githubUrl: data.githubUrl || null,
        projectType: data.projectType,
        screenshotUrl,
        highlight1: data.highlight1,
        highlight2: data.highlight2,
        highlight3: data.highlight3,
        platforms: data.platforms,
        techStack: data.techStack ?? [],
        pricingType: data.pricingType ?? null,
        priceAmount: data.priceAmount ?? null,
        priceCurrency: data.priceCurrency ?? "IDR",
        pricingNote: data.pricingNote ?? null,
        developerContact: data.developerContact,
        status: ProductStatus.pending,
        categories: {
          create: data.categoryIds.map((categoryId) => ({ categoryId })),
        },
        aiTools: {
          create: data.aiToolIds.map((aiToolId) => ({ aiToolId })),
        },
      },
      include: {
        categories: { include: { category: true } },
        aiTools: { include: { aiTool: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
