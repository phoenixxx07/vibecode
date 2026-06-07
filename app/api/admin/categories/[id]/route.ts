import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { categoryUpdateSchema } from "@/lib/validators";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const parsed = categoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, slug, icon } = parsed.data;
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(name !== undefined && slug === undefined && { slug: slugify(name) }),
        ...(icon !== undefined && { icon }),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 409 });
    }
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

    const usage = await prisma.productCategory.count({ where: { categoryId: id } });
    if (usage > 0) {
      return NextResponse.json(
        { error: `Kategori dipakai ${usage} proyek. Tidak bisa dihapus.` },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
