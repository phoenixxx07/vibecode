import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { metadataValue } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { metadataOptionUpdateSchema } from "@/lib/validators";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const parsed = metadataOptionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const existing = await prisma.metadataOption.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { value, label, icon, sortOrder, isActive } = parsed.data;
    const nextValue =
      value !== undefined
        ? value
        : label !== undefined
          ? metadataValue(label)
          : existing.value;

    const option = await prisma.$transaction(async (tx) => {
      if (nextValue !== existing.value) {
        if (existing.type === "project_type") {
          await tx.product.updateMany({
            where: { projectType: existing.value },
            data: { projectType: nextValue },
          });
        } else if (existing.type === "pricing_type") {
          await tx.product.updateMany({
            where: { pricingType: existing.value },
            data: { pricingType: nextValue },
          });
        } else {
          const products = await tx.product.findMany({
            where: { platforms: { has: existing.value } },
            select: { id: true, platforms: true },
          });
          for (const product of products) {
            await tx.product.update({
              where: { id: product.id },
              data: {
                platforms: product.platforms.map((p) =>
                  p === existing.value ? nextValue : p
                ),
              },
            });
          }
        }
      }

      return tx.metadataOption.update({
        where: { id },
        data: {
          ...(value !== undefined && { value }),
          ...(label !== undefined && {
            label,
            ...(value === undefined && { value: metadataValue(label) }),
          }),
          ...(icon !== undefined && { icon }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(isActive !== undefined && { isActive }),
        },
      });
    });

    return NextResponse.json(option);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Value sudah digunakan" }, { status: 409 });
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

    const option = await prisma.metadataOption.findUnique({ where: { id } });
    if (!option) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const productUsage = await prisma.product.count({
      where:
        option.type === "project_type"
          ? { projectType: option.value }
          : option.type === "pricing_type"
            ? { pricingType: option.value }
            : { platforms: { has: option.value } },
    });

    if (productUsage > 0) {
      await prisma.metadataOption.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        ok: true,
        deactivated: true,
        message: `Dinonaktifkan — dipakai ${productUsage} proyek`,
      });
    }

    await prisma.metadataOption.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
