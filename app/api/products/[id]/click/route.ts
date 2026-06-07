import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clickSchema } from "@/lib/validators";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = clickSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await prisma.product.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
