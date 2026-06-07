import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminPromoteSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = adminPromoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User belum terdaftar. Minta mereka login via Google dulu, lalu tambahkan lagi.",
        },
        { status: 404 }
      );
    }

    if (user.role === UserRole.admin) {
      return NextResponse.json(
        { error: "User sudah menjadi admin." },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: UserRole.admin },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
