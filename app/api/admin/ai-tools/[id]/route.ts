import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiToolUpdateSchema } from "@/lib/validators";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const parsed = aiToolUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, website, logoUrl, isApproved } = parsed.data;
    const aiTool = await prisma.aiTool.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(website !== undefined && { website: website || null }),
        ...(logoUrl !== undefined && { logoUrl: logoUrl || null }),
        ...(isApproved !== undefined && { isApproved }),
      },
    });

    return NextResponse.json(aiTool);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Nama AI tool sudah ada" }, { status: 409 });
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

    const usage = await prisma.productAiTool.count({ where: { aiToolId: id } });
    if (usage > 0) {
      return NextResponse.json(
        { error: `AI tool dipakai ${usage} proyek. Nonaktifkan saja.` },
        { status: 409 }
      );
    }

    await prisma.aiTool.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
