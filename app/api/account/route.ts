import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function DELETE() {
  try {
    const session = await requireAuth();

    if (session.user.role === UserRole.admin) {
      return NextResponse.json(
        { error: "Akun admin tidak bisa dihapus dari dashboard." },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
