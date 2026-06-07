import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getMetadataValidationValues } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { getProductById } from "@/lib/products";
import { isManualScreenshot } from "@/lib/screenshot-upload";
import { getProjectScreenshot } from "@/lib/thumio";
import { buildProductUpdateSchema } from "@/lib/validators";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validationValues = await getMetadataValidationValues();
    const parsed = buildProductUpdateSchema(validationValues).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;
    const urlOrTypeChanged =
      data.url !== undefined ||
      data.projectType !== undefined ||
      data.githubUrl !== undefined;

    const screenshotUrl = isManualScreenshot(existing.screenshotUrl)
      ? existing.screenshotUrl
      : urlOrTypeChanged
        ? getProjectScreenshot(
            data.projectType ?? existing.projectType,
            data.url ?? existing.url,
            data.githubUrl ?? existing.githubUrl
          )
        : existing.screenshotUrl;

    if (data.categoryIds) {
      await prisma.productCategory.deleteMany({ where: { productId: id } });
    }
    if (data.aiToolIds) {
      await prisma.productAiTool.deleteMany({ where: { productId: id } });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.tagline && { tagline: data.tagline }),
        ...(data.url && { url: data.url }),
        ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl || null }),
        ...(data.projectType && { projectType: data.projectType }),
        screenshotUrl,
        ...(data.highlight1 && { highlight1: data.highlight1 }),
        ...(data.highlight2 && { highlight2: data.highlight2 }),
        ...(data.highlight3 && { highlight3: data.highlight3 }),
        ...(data.platforms && { platforms: data.platforms }),
        ...(data.techStack && { techStack: data.techStack }),
        ...(data.pricingType !== undefined && {
          pricingType: data.pricingType ?? null,
        }),
        ...(data.priceAmount !== undefined && { priceAmount: data.priceAmount }),
        ...(data.priceCurrency !== undefined && { priceCurrency: data.priceCurrency }),
        ...(data.pricingNote !== undefined && { pricingNote: data.pricingNote }),
        ...(data.developerContact && { developerContact: data.developerContact }),
        status: session.user.role === "admin" ? existing.status : "pending",
        ...(data.categoryIds && {
          categories: {
            create: data.categoryIds.map((categoryId) => ({ categoryId })),
          },
        }),
        ...(data.aiToolIds && {
          aiTools: {
            create: data.aiToolIds.map((aiToolId) => ({ aiToolId })),
          },
        }),
      },
      include: {
        categories: { include: { category: true } },
        aiTools: { include: { aiTool: true } },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
