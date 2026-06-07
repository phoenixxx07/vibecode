import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminReviewSchema } from "@/lib/validators";
import { ProductStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = adminReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { productId, status, rejectionReason, isFeatured } = parsed.data;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        status: status as ProductStatus,
        rejectionReason:
          status === "rejected" ? rejectionReason ?? "Ditolak admin" : null,
        ...(isFeatured !== undefined && { isFeatured }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
