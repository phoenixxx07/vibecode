import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminProductUpdateSchema } from "@/lib/validators";
import { ProductStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const parsed = adminProductUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { isFeatured, status, rejectionReason } = parsed.data;
    if (isFeatured === undefined && status === undefined) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(isFeatured !== undefined && { isFeatured }),
        ...(status !== undefined && {
          status: status as ProductStatus,
          ...(status === "rejected" && {
            rejectionReason: rejectionReason ?? "Ditangguhkan/ditolak admin",
            isFeatured: false,
          }),
          ...(status === "pending" && {
            rejectionReason: null,
            isFeatured: false,
          }),
          ...(status === "approved" && { rejectionReason: null }),
        }),
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
