import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateScreenshotFile } from "@/lib/screenshot";
import {
  deleteManualScreenshotFile,
  saveProductScreenshot,
} from "@/lib/screenshot-upload";
import { getProjectScreenshot } from "@/lib/thumio";
import { ProductStatus } from "@prisma/client";

async function getOwnedApprovedProduct(id: string, userId: string, role: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { error: "Not found", status: 404 as const, product: null };
  if (product.userId !== userId && role !== "admin") {
    return { error: "Forbidden", status: 403 as const, product: null };
  }
  if (product.status !== ProductStatus.approved) {
    return {
      error: "Upload preview hanya tersedia setelah proyek disetujui",
      status: 403 as const,
      product: null,
    };
  }
  return { error: null, status: 200 as const, product };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const { error, status, product } = await getOwnedApprovedProduct(
      id,
      session.user.id,
      session.user.role
    );
    if (!product) {
      return NextResponse.json({ error }, { status });
    }

    const form = await req.formData();
    const file = form.get("screenshot");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File screenshot wajib diisi" }, { status: 400 });
    }

    const validationError = validateScreenshotFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await deleteManualScreenshotFile(product.screenshotUrl);
    const screenshotUrl = await saveProductScreenshot(id, file);

    const updated = await prisma.product.update({
      where: { id },
      data: { screenshotUrl },
      include: {
        categories: { include: { category: true } },
        aiTools: { include: { aiTool: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    const code = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status: code });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const { error, status, product } = await getOwnedApprovedProduct(
      id,
      session.user.id,
      session.user.role
    );
    if (!product) {
      return NextResponse.json({ error }, { status });
    }

    await deleteManualScreenshotFile(product.screenshotUrl);
    const screenshotUrl = getProjectScreenshot(
      product.projectType,
      product.url,
      product.githubUrl
    );

    const updated = await prisma.product.update({
      where: { id },
      data: { screenshotUrl },
      include: {
        categories: { include: { category: true } },
        aiTools: { include: { aiTool: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    const code = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status: code });
  }
}
