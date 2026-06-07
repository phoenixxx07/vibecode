import { NextRequest, NextResponse } from "next/server";
import { MetadataType } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { metadataValue } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { metadataOptionCreateSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const type = req.nextUrl.searchParams.get("type") as MetadataType | null;

    const options = await prisma.metadataOption.findMany({
      where: type ? { type } : undefined,
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { label: "asc" }],
    });

    return NextResponse.json(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = metadataOptionCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { type, label, icon, sortOrder, isActive } = parsed.data;
    const value = parsed.data.value ?? metadataValue(label);

    const option = await prisma.metadataOption.create({
      data: {
        type,
        value,
        label,
        icon: icon ?? null,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(option, { status: 201 });
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
